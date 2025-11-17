import React from 'react';
import { Box, Heading, VStack, FormControl, Input, Button, Center, Text, Link } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    // Lógica de autenticação aqui
    // Por enquanto, apenas navegamos para a tela principal
    navigation.navigate('Main' as never);
  };

  return (
    <Center flex={1} px="3">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600">
          Bem-vindo
        </Heading>
        <Heading mt="1" fontWeight="medium" size="xs">
          Faça login para continuar!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl>
            <FormControl.Label>Senha</FormControl.Label>
            <Input type="password" />
            <Link _text={{ fontSize: 'xs', fontWeight: '500', color: 'primary.500' }} alignSelf="flex-end" mt="1">
              Esqueceu a senha?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="primary" onPress={handleLogin}>
            Entrar
          </Button>
          <VStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="muted.600">
              Não tem uma conta?{' '}
            </Text>
            <Link _text={{ color: 'primary.500', fontWeight: 'medium', fontSize: 'sm' }}>
              Cadastre-se
            </Link>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen;
