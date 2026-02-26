package com.bitespeed.service;

import com.bitespeed.dto.IdentifyRequest;
import com.bitespeed.dto.IdentifyResponse;
import com.bitespeed.dto.IdentifyResponse.ContactResponse;
import com.bitespeed.model.Contact;
import com.bitespeed.model.Contact.LinkPrecedence;
import com.bitespeed.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public IdentifyResponse identify(IdentifyRequest request) {
        String email = request.getEmail();
        String phoneNumber = request.getPhoneNumber();

        // Normalize empty strings to null
        if (email != null && email.isBlank())
            email = null;
        if (phoneNumber != null && phoneNumber.isBlank())
            phoneNumber = null;

        // Find all contacts matching email or phone
        List<Contact> matchingContacts = contactRepository.findByEmailOrPhoneNumber(email, phoneNumber);

        if (matchingContacts.isEmpty()) {
            // No existing contact — create a new primary contact
            Contact newContact = createContact(email, phoneNumber, null, LinkPrecedence.PRIMARY);
            return buildResponse(newContact);
        }

        // Gather all related contacts (follow linkedId chains)
        Set<Integer> allRelatedIds = new HashSet<>();
        for (Contact c : matchingContacts) {
            collectAllRelatedIds(c, allRelatedIds);
        }

        // Fetch all related contacts
        List<Contact> allContacts = contactRepository.findAllById(allRelatedIds);

        // Find all primary contacts among these
        List<Contact> primaries = allContacts.stream()
                .filter(c -> c.getLinkPrecedence() == LinkPrecedence.PRIMARY)
                .sorted(Comparator.comparing(Contact::getCreatedAt))
                .collect(Collectors.toList());

        Contact primaryContact;

        if (primaries.size() > 1) {
            // Multiple primaries found — the oldest stays primary, others become secondary
            primaryContact = primaries.get(0);
            for (int i = 1; i < primaries.size(); i++) {
                Contact olderSecondary = primaries.get(i);
                olderSecondary.setLinkPrecedence(LinkPrecedence.SECONDARY);
                olderSecondary.setLinkedId(primaryContact.getId());
                contactRepository.save(olderSecondary);

                // Also re-link any contacts that pointed to this former primary
                List<Contact> children = contactRepository.findByLinkedId(olderSecondary.getId());
                for (Contact child : children) {
                    child.setLinkedId(primaryContact.getId());
                    contactRepository.save(child);
                }
            }
        } else if (primaries.size() == 1) {
            primaryContact = primaries.get(0);
        } else {
            // All are secondary — find the ultimate primary
            Contact any = allContacts.get(0);
            primaryContact = findPrimaryContact(any);
            allContacts = new ArrayList<>();
            allRelatedIds.clear();
            collectAllRelatedIds(primaryContact, allRelatedIds);
            allContacts = contactRepository.findAllById(allRelatedIds);
        }

        // Check if this request brings new information
        boolean hasNewInfo = needsNewSecondary(allContacts, email, phoneNumber);
        if (hasNewInfo && email != null && phoneNumber != null) {
            createContact(email, phoneNumber, primaryContact.getId(), LinkPrecedence.SECONDARY);
        }

        // Re-fetch all contacts for this primary to build the final response
        return buildResponseForPrimary(primaryContact);
    }

    private boolean needsNewSecondary(List<Contact> allContacts, String email, String phoneNumber) {
        if (email == null || phoneNumber == null) {
            return false;
        }

        // Check if there is already a contact with this exact email AND phone
        // combination
        boolean exactMatchExists = allContacts.stream()
                .anyMatch(c -> email.equals(c.getEmail()) && phoneNumber.equals(c.getPhoneNumber()));
        if (exactMatchExists) {
            return false;
        }

        // New secondary is needed if the exact combination doesn't exist yet
        return !exactMatchExists;
    }

    private Contact createContact(String email, String phoneNumber, Integer linkedId, LinkPrecedence precedence) {
        Contact contact = new Contact();
        contact.setEmail(email);
        contact.setPhoneNumber(phoneNumber);
        contact.setLinkedId(linkedId);
        contact.setLinkPrecedence(precedence);
        return contactRepository.save(contact);
    }

    private void collectAllRelatedIds(Contact contact, Set<Integer> ids) {
        if (contact == null || ids.contains(contact.getId()))
            return;

        ids.add(contact.getId());

        // Go up to the primary
        if (contact.getLinkedId() != null) {
            Optional<Contact> parent = contactRepository.findById(contact.getLinkedId());
            parent.ifPresent(p -> collectAllRelatedIds(p, ids));
        }

        // Go down to all children
        List<Contact> children = contactRepository.findByLinkedId(contact.getId());
        for (Contact child : children) {
            collectAllRelatedIds(child, ids);
        }
    }

    private Contact findPrimaryContact(Contact contact) {
        if (contact.getLinkPrecedence() == LinkPrecedence.PRIMARY) {
            return contact;
        }
        if (contact.getLinkedId() != null) {
            Optional<Contact> parent = contactRepository.findById(contact.getLinkedId());
            if (parent.isPresent()) {
                return findPrimaryContact(parent.get());
            }
        }
        return contact;
    }

    private IdentifyResponse buildResponse(Contact primaryContact) {
        List<String> emails = new ArrayList<>();
        List<String> phoneNumbers = new ArrayList<>();
        List<Integer> secondaryContactIds = new ArrayList<>();

        if (primaryContact.getEmail() != null)
            emails.add(primaryContact.getEmail());
        if (primaryContact.getPhoneNumber() != null)
            phoneNumbers.add(primaryContact.getPhoneNumber());

        return new IdentifyResponse(new ContactResponse(
                primaryContact.getId(), emails, phoneNumbers, secondaryContactIds));
    }

    private IdentifyResponse buildResponseForPrimary(Contact primaryContact) {
        // Get all contacts linked to this primary
        List<Contact> secondaries = contactRepository.findByLinkedId(primaryContact.getId());

        // Build ordered lists with primary's info first
        LinkedHashSet<String> emails = new LinkedHashSet<>();
        LinkedHashSet<String> phoneNumbers = new LinkedHashSet<>();
        List<Integer> secondaryContactIds = new ArrayList<>();

        // Primary first
        if (primaryContact.getEmail() != null)
            emails.add(primaryContact.getEmail());
        if (primaryContact.getPhoneNumber() != null)
            phoneNumbers.add(primaryContact.getPhoneNumber());

        // Then secondaries (sorted by creation time)
        secondaries.sort(Comparator.comparing(Contact::getCreatedAt));
        for (Contact sec : secondaries) {
            if (sec.getEmail() != null)
                emails.add(sec.getEmail());
            if (sec.getPhoneNumber() != null)
                phoneNumbers.add(sec.getPhoneNumber());
            secondaryContactIds.add(sec.getId());
        }

        return new IdentifyResponse(new ContactResponse(
                primaryContact.getId(),
                new ArrayList<>(emails),
                new ArrayList<>(phoneNumbers),
                secondaryContactIds));
    }
}
