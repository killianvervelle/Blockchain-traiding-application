package com.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssuanceRequestDto {
    private Long id;
    private String initiator;
    private String date;
    private String token_id;
    private String amount;
    private String issuer;
    private String status;
}
