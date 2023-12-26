import { listMyChartByPageUsingPOST } from '@/services/yubi/chartController';
import { Avatar, List, message } from 'antd';
import React, { useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';
/**
 * 我的图表页面
 * @constructor
 */

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 12,
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams }); // 查询参数
  const [chartList, setChartList] = useState<API.Chart[]>(); // 图表列表
  const [total, setTotal] = useState<number>(0); // 分页总数
  const [loading, setLoading] = useState<boolean>(true); // 加载状态

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart-page">
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: searchParams.pageSize,
        }}
        loading={loading}
        dataSource={chartList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar src={'https://xsgames.co/randomusers/avatar.php?g=pixel&amp;key=0'} />
              }
              title={item.name}
              description={item.charType ? '图表类型：' + item.charType : undefined}
            />
            {'分析目标：' + item.goal}
            <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  );
};
export default MyChartPage;
