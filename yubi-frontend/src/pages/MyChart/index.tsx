import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

import { Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload } from 'antd';
import { genChartByAiUsingPOST } from '../../services/yubi/chartController';

import ReactECharts from 'echarts-for-react';

/**
 * 我的图表页面
 * @constructor
 */

const AddChart: React.FC = () => {
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  const [chart, setChart] = useState<API.BiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>();
  /**
   *  表单提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // console.log(values.file);
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // TODO: 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(res);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
        setChart(res.data);
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chart'}>
      我的图表
    </div>
  );
};
export default AddChart;
