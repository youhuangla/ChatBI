import { listMyChartByPageUsingPOST } from '@/services/yubi/chartController';
import { Avatar, Card, Input, List, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { useModel } from '@@/exports';
import ReactECharts from 'echarts-for-react';
/**
 * 我的图表页面
 * @constructor
 */

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams }); // 查询参数
  const { initialState } = useModel('@@initialState'); // 当前用户信息
  const { currentUser } = initialState ?? {}; // 在 User/login 将 currentUser 设置到了全局变量中
  const [chartList, setChartList] = useState<API.Chart[]>(); // 图表列表
  const [total, setTotal] = useState<number>(0); // 分页总数
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const { Search } = Input;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏图表的title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          });
        }
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
      <div>
        <Search
          placeholder="请输入图表名称"
          loading={loading}
          enterButton
          // 设置搜索条件
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16" />
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.charType ? '图表类型：' + item.charType : undefined}
              />
              <div style={{ marginBottom: 16 }} />
              <p>{'分析目标：' + item.goal}</p>
              <div style={{ marginBottom: 16 }} />
              <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
            </Card>
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  );
};
export default MyChartPage;
