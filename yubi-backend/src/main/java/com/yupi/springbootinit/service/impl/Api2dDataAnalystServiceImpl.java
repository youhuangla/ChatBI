package com.yupi.springbootinit.service.impl;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONUtil;
import cn.hutool.json.JSONObject;
import com.yupi.springbootinit.service.ApiService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class Api2dDataAnalystServiceImpl implements ApiService {

    private static final String URL = "https://oa.api2d.net/v1/chat/completions";

    public String getContentFromApi(String analysisRequirement/*, String csvData*/) {
        String csvData = "csvData";
        // 创建请求体
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("model", "gpt-3.5-turbo");

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是一个数据分析师和前端开发专家。");

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "分析需求：\n" + analysisRequirement + "\n原始数据：\n" + csvData);

        bodyMap.put("messages", new Map[]{systemMessage, userMessage});
        bodyMap.put("safe_mode", false);

        String jsonBody = JSONUtil.toJsonStr(bodyMap);
        String api2d_api_key = System.getenv("API2D_API_KEY");

        // 发送请求
        HttpResponse response = HttpRequest.post(URL)
                .header("Authorization", "Bearer " + api2d_api_key)
                .header("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
                .header("Content-Type", "application/json")
                .body(jsonBody)
                .timeout(0)  // 设置超时时间为无限
                .execute();

        if (response.isOk()) {
            JSONObject jsonObject = JSONUtil.parseObj(response.body());
            return jsonObject.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getStr("content");
        } else {
            return "请求失败，状态码：" + response.getStatus();
        }
    }
}
