package com.scac.admin.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "admin_memo",
    indexes = {
        @Index(name = "idx_admin_memo_admin", columnList = "admin_id"),
        @Index(name = "idx_admin_memo_created", columnList = "created_at DESC")
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminMemo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AdminAccount admin;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String content;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false,
            insertable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false,
            insertable = false
    )
    private LocalDateTime updatedAt;

    @Builder
    public AdminMemo(
            AdminAccount admin,
            String content
    ) {
        this.admin = admin;
        this.content = content;
    }

    /**
     * 메모 내용 수정
     */
    public void updateContent(String content) {
        this.content = content;
    }

}
