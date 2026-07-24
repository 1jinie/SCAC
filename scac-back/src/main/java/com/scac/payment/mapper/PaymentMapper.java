package com.scac.payment.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.scac.payment.dto.PaymentHistoryDTO;

@Mapper
public interface PaymentMapper {

  List<PaymentHistoryDTO> findAllPaymentHistory();

  List<PaymentHistoryDTO> findByUserId(@Param("userId") Long userId);


}
