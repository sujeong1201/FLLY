package com.ssafy.flowerly.entity;

import com.ssafy.flowerly.entity.common.BaseTimeEntity;
import com.ssafy.flowerly.review.dto.ReviewDetailDto;
import com.ssafy.flowerly.review.dto.ReviewResponseDto;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.format.DateTimeFormatter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate //update시, 실제 값이 변경되는 컬럼만 update 쿼리로 생성
@Builder
@ToString
public class Review extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consumer_id")
    private Member consumer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Member seller;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Boolean isRemoved;

    public ReviewDetailDto toDetailDto(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return ReviewDetailDto.builder()
                .reviewId(this.reviewId)
                .consumerNickName(this.consumer.getNickName())
                .content(this.content)
                .createdAt(this.getCreatedAt() != null ? this.getCreatedAt().format(formatter) : null)
                .build();
    }

    public void markAsRemoved() {
        this.isRemoved = true;

    }



}
