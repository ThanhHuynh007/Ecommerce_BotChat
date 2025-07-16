import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Avatar, Card, Spin, Tooltip } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const Chatbot = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // Scroll xuống cuối mỗi lần thêm tin nhắn
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chatbot', {
        message: input,
      });
      const botReply = response.data.reply || 'Xin lỗi, tôi chưa hiểu câu hỏi.';
      setMessages([...newMessages, { role: 'bot', content: botReply }]);
    } catch (error) {
      console.error('Chatbot error:', error.response?.data || error.message);
      setMessages([
        ...newMessages,
        { role: 'bot', content: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút nổi mở chatbot */}
      {!visible && (
        <Tooltip title="Trợ lý XCenter">
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined />}
            size="large"
            onClick={() => setVisible(true)}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          />
        </Tooltip>
      )}

      {/* Hộp chatbot */}
      {visible && (
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>💬 Trợ lý ảo XCenter</span>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setVisible(false)}
              />
            </div>
          }
          bodyStyle={{ padding: 12, maxHeight: '300px', overflowY: 'auto' }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            zIndex: 1000,
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            borderRadius: 8,
          }}
        >
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                style={{
                  justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={item.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        backgroundColor: item.role === 'user' ? '#1890ff' : '#52c41a',
                      }}
                    />
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
          <div ref={messageEndRef} />
          <div style={{ display: 'flex', marginTop: 8 }}>
            <TextArea
              rows={1}
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              style={{ marginLeft: 8 }}
              disabled={loading}
            />
          </div>
          {loading && <Spin style={{ marginTop: 8 }} />}
        </Card>
      )}
    </>
  );
};

export default Chatbot;
