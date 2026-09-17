package com.securequestionpaper.questionpapermanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "security_settings")
public class SecuritySetting {

    @Id
    private Long id;

    private boolean mfaEnabled;

    public SecuritySetting() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }
}