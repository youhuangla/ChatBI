package com.yupi.springbootinit.manager;

import com.yupi.springbootinit.api.Api2dServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class AiManager {

    @Resource
    private Api2dServiceImpl api2dService;

    /**
     * 获取AI对话内容
     * @param query
     * @return
     */
    public String doChat(String query) {
        return api2dService.getContentFromApi(query);
    }
}
