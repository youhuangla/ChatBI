package com.yupi.springbootinit.api;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONUtil;

import java.util.HashMap;
import java.util.Map;

public class api2dApi {
    public static void main(String[] args) {
        String url = "https://oa.api2d.net/v1/chat/completions";

        // 创建请求体
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("model", "gpt-3.5-turbo");
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", "讲个笑话");
        bodyMap.put("messages", new Map[] {message});
        bodyMap.put("safe_mode", false);

        String jsonBody = JSONUtil.toJsonStr(bodyMap);
        String api2d_api_key = System.getenv("API2D_API_KEY");
        // 发送请求
        HttpResponse response = HttpRequest.post(url)
                .header("Authorization", "Bearer " + api2d_api_key)  // 请替换为您的真实token
                .header("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
                .header("Content-Type", "application/json")
                .body(jsonBody)
                .timeout(0)  // 设置超时时间为无限
                .execute();

        if(response.isOk()) {
            System.out.println(response.body());
        } else {
            System.out.println("请求失败，状态码：" + response.getStatus());
        }
    }
}

/*
package com.yupi.springbootinit.api;


import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONUtil;

import java.util.HashMap;
import java.util.Map;

public class openAiApi {
    public static void main(String[] args) {
        String url = "https://api.openai.com/v1/chat/completions";
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("message", "用户的消息，请帮我分析");
        String json = JSONUtil.toJsonStr(hashMap);
        String result = HttpRequest.post(url)
                .header("Authorization", "Bearer sk-......")
                .body(json)
                .execute()
                .body();
        System.out.println(result);
        return ;
    }
}
*/