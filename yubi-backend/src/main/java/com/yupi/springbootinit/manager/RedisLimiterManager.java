package com.yupi.springbootinit.manager;

import com.yupi.springbootinit.common.ErrorCode;
import com.yupi.springbootinit.exception.BusinessException;
import org.redisson.api.RRateLimiter;
import org.redisson.api.RateIntervalUnit;
import org.redisson.api.RateType;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Redis限流管理器，专门提供RedisLimiter限流基础服务（提供了通用的能力）
 */
@Service
public class RedisLimiterManager {
    @Resource
    private RedissonClient redissonClient;

    /**
     * 限流操作
     *
     * @param key 区分不同的限流器，比如不同的用户id应分别统计
     *
     */

    public void doRateLimit(String key) {
        // 创建一个限流器，限流器名称为：rateLimiter
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(key);
        // 初始化：最大流速 = 每rateInterval秒钟产生rate个令牌
        rateLimiter.trySetRate(RateType.OVERALL, 2, 1, RateIntervalUnit.SECONDS);

        boolean canOp = rateLimiter.tryAcquire(1);
        if (!canOp) {
            throw new BusinessException(ErrorCode.TOO_MANY_REQUEST);
        }
    }
}
