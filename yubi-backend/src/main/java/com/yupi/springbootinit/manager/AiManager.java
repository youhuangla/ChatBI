package com.yupi.springbootinit.manager;

import com.yupi.springbootinit.service.impl.Api2dDataAnalystServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class AiManager {

    @Resource
    private Api2dDataAnalystServiceImpl api2dService;
    /**
     * 获取AI对话内容
     * @param query
     * @return
     */
    public String doChat(String query) {
        return api2dService.getContentFromApi(query);
    }
}
