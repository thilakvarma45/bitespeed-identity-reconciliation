package com.bitespeed.repository;

import com.bitespeed.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    List<Contact> findByEmail(String email);

    List<Contact> findByPhoneNumber(String phoneNumber);

    @Query("SELECT c FROM Contact c WHERE " +
            "(:email IS NOT NULL AND c.email = :email) OR " +
            "(:phoneNumber IS NOT NULL AND c.phoneNumber = :phoneNumber)")
    List<Contact> findByEmailOrPhoneNumber(@Param("email") String email,
            @Param("phoneNumber") String phoneNumber);

    List<Contact> findByLinkedId(Integer linkedId);
}
