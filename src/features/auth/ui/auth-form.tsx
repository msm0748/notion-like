import { useState } from 'react';
import { Paper, Title, Text, Container, Button, Center } from '@mantine/core';
import { FcGoogle } from 'react-icons/fc';
import { googleLogin } from '../api/auth';

export const AuthForm = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await googleLogin();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: unknown) {
      setErrorMsg(
        (err as Error).message || 'Google 로그인 오류가 발생했습니다.',
      );
      setLoading(false);
    }
  };

  return (
    <Center
      sx={{ width: '100vw', height: '100vh', backgroundColor: '#FAFAFA' }}
    >
      <Container size={420} w="100%">
        <Title ta="center">나만의 Notion</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          다시 오신 것을 환영합니다! 로그인을 진행해 주세요.
        </Text>

        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          sx={{ backgroundColor: '#FFFFFF' }}
        >
          {errorMsg && (
            <Text c="red" size="sm" ta="center" mb="lg">
              {errorMsg}
            </Text>
          )}

          <Button
            variant="default"
            fullWidth
            radius="sm"
            size="md"
            onClick={handleGoogleLogin}
            loading={loading}
            leftSection={<FcGoogle size={20} />}
          >
            Google 계정으로 계속하기
          </Button>
        </Paper>
      </Container>
    </Center>
  );
};
