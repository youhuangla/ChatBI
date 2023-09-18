import { listChartByPageUsingPOST } from '@/services/yubi/chartController';
import { useModel } from '@umijs/max';

import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

import { Button, Form, Select, Space, Upload } from 'antd';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onFinish = (values: any) => {
  // TODO: 对接后端，上传数据
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    listChartByPageUsingPOST({}).then((res) => {
      console.error(res);
    });
  });

  return (
    <div className={'add-chart'}>
      <Form name="addChart" {...formItemLayout} onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="rate"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
        </Form.Item>
        <Form.Item name="name " label="图表名称">
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="reset">reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
