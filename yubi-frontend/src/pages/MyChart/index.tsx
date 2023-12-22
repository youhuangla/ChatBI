import { listMyChartByPageUsingPOST } from '@/services/yubi/chartController';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

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

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart-page">
      数据列表：
      {JSON.stringify(chartList)}
      <br />
      总数：{total}
    </div>
  );
};
export default MyChartPage;
