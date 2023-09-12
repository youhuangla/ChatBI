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
    /**
     * TODO: 实现一个更泛用的Api2dServiceImpl方法，可以使用不同的API
     */
    private static final String URL = "https://oa.api2d.net/v1/chat/completions";

    public String getContentFromApi(String analysisRequirement/*, String csvData*/) {
        System.out.println("User: ");
        System.out.println(analysisRequirement);
        String csvData = "csvData";
        // 创建请求体
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("model", "gpt-3.5-turbo");

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是一个数据分析师和前端开发专家，接下来我会按照以下固定格式给你提供内容：\n" +
                "分析需求：\n" +
                "{数据分析的需求或者目标}\n" +
                "原始数据：\n" +
                "{csv格式的原始数据，用，作为分隔符}\n" +
                "请根据这两部分内容，严格按照以下指定格式生成内容（此外不要输出任何多余的开头、结尾、注释）\n" +
                "【【【【【\n" +
                "{前端Echarts V5的option配置对象js代码，合理地将数据进行可视化，不要生成任何多余的内容，比如注释}\n" +
                "【【【【【\n" +
                "{明确的数据分析结论、越详细越好，不要生成多余的注释}");

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        //userMessage.put("content", "分析需求：\n" + analysisRequirement + "\n原始数据：\n" + csvData);
        userMessage.put("content", analysisRequirement);
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
