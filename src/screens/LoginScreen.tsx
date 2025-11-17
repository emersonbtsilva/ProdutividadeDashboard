import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  Text,
  Link,
  HStack,
  Icon,
  Pressable,
  Divider,
  Checkbox
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEmailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPassInvalid = password.length > 0 && password.length < 6;

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      // Sem backend por enquanto: segue mesmo sem validar campos
      await signIn(email || 'guest@local', password || 'dev', remember);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg={{ linearGradient: { colors: ['primary.600', 'primary.800'], start: [0, 0], end: [0, 1] } }}>
      <Box safeAreaTop />
      {/* Top brand / hero */}
      <Box px={6} pt={8} pb={24}>
        <Heading color="white" size="2xl">Produtividade+</Heading>
        <Text color="white" mt={2} opacity={0.85}>Organize suas tarefas e alcance suas metas</Text>
      </Box>

      {/* Card */}
      <Center px={6}>
        <Box w="100%" maxW="400" bg="white" _dark={{ bg: 'coolGray.900' }} rounded="2xl" p={6} shadow={9} mt={-16}>
          <Heading size="lg">Bem-vindo</Heading>
          <Text mt={1} color="muted.500">Você pode continuar sem login por enquanto.</Text>

          <VStack space={4} mt={6}>
            <FormControl isInvalid={isEmailInvalid}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="voce@email.com"
                variant="filled"
                bg="muted.100"
                InputLeftElement={<Icon as={<Ionicons name="mail-outline" />} ml="3" size="5" color="muted.500" />}
              />
              {isEmailInvalid && (
                <FormControl.ErrorMessage>Informe um email válido</FormControl.ErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isPassInvalid}>
              <FormControl.Label>Senha</FormControl.Label>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                type={showPass ? 'text' : 'password'}
                variant="filled"
                bg="muted.100"
                InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline" />} ml="3" size="5" color="muted.500" />}
                InputRightElement={
                  <Pressable onPress={() => setShowPass(s => !s)} mr="3">
                    <Icon as={<Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} />} size="5" color="muted.500" />
                  </Pressable>
                }
              />
              {isPassInvalid && (
                <FormControl.ErrorMessage>Mínimo de 6 caracteres</FormControl.ErrorMessage>
              )}
            </FormControl>

            <HStack alignItems="center" justifyContent="space-between">
              <Checkbox value="remember" isChecked={remember} onChange={setRemember} accessibilityLabel="Lembrar de mim">
                Lembrar de mim
              </Checkbox>
              <Link _text={{ color: 'primary.600', fontWeight: '600' }}>Esqueceu a senha?</Link>
            </HStack>

            <Button mt={2} size="lg" rounded="xl" onPress={handleLogin} isLoading={submitting || isLoading}>
              Continuar
            </Button>

            <HStack alignItems="center" space={2} my={2}>
              <Divider flex={1} />
              <Text color="muted.500">ou</Text>
              <Divider flex={1} />
            </HStack>

            <HStack space={3}>
              <Button flex={1} variant="outline" leftIcon={<Icon as={Ionicons} name="logo-google" />}>Google</Button>
              <Button flex={1} variant="outline" leftIcon={<Icon as={Ionicons} name="logo-apple" />}>Apple</Button>
            </HStack>

            <HStack justifyContent="center" mt={2}>
              <Link onPress={handleLogin} _text={{ color: 'primary.600', fontWeight: '600' }}>Pular por enquanto</Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default LoginScreen;
