package com.bitespeed.dto;

import java.util.List;

public class IdentifyResponse {
    private ContactResponse contact;

    public IdentifyResponse() {
    }

    public IdentifyResponse(ContactResponse contact) {
        this.contact = contact;
    }

    public ContactResponse getContact() {
        return contact;
    }

    public void setContact(ContactResponse contact) {
        this.contact = contact;
    }

    public static class ContactResponse {
        private Integer primaryContatctId;
        private List<String> emails;
        private List<String> phoneNumbers;
        private List<Integer> secondaryContactIds;

        public ContactResponse() {
        }

        public ContactResponse(Integer primaryContatctId, List<String> emails,
                List<String> phoneNumbers, List<Integer> secondaryContactIds) {
            this.primaryContatctId = primaryContatctId;
            this.emails = emails;
            this.phoneNumbers = phoneNumbers;
            this.secondaryContactIds = secondaryContactIds;
        }

        // Note: field name matches the typo in the task spec ("primaryContatctId")
        public Integer getPrimaryContatctId() {
            return primaryContatctId;
        }

        public void setPrimaryContatctId(Integer primaryContatctId) {
            this.primaryContatctId = primaryContatctId;
        }

        public List<String> getEmails() {
            return emails;
        }

        public void setEmails(List<String> emails) {
            this.emails = emails;
        }

        public List<String> getPhoneNumbers() {
            return phoneNumbers;
        }

        public void setPhoneNumbers(List<String> phoneNumbers) {
            this.phoneNumbers = phoneNumbers;
        }

        public List<Integer> getSecondaryContactIds() {
            return secondaryContactIds;
        }

        public void setSecondaryContactIds(List<Integer> secondaryContactIds) {
            this.secondaryContactIds = secondaryContactIds;
        }
    }
}
