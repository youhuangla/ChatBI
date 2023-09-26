import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

import { Button, Form, message, Select, Space, Upload } from 'antd';
import { genChartByAiUsingPOST } from '../../services/yubi/chartController';

import ReactECharts from 'echarts-for-react';

/**
 * 添加图表页面
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
      <Form name="addChart" onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
        </Form.Item>
        <Form.Item name="name" label="图表名称">
          <TextArea placeholder="请输入图表名称" />
        </Form.Item>
        <Form.Item name="chartType" label="图表类型">
          <Select
            defaultValue="待选择"
            options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
            ]}
          />
        </Form.Item>

        <Form.Item name="file" label="原始数据">
          <Upload name="file">
            <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
              智能分析
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>分析结论：{chart?.genResult}</div>
      {/*<div>生成图表：<ReactECharts option={options} />;</div>*/}
      <div>
        生成图表：
        {option && <ReactECharts option={option}/>}
      </div>
    </div>
  );
};
export default AddChart;
