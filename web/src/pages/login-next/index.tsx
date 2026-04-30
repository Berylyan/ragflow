import SvgIcon from '@/components/svg-icon';
import { useAuth } from '@/hooks/auth-hooks';
import {
  useLogin,
  useLoginChannels,
  useLoginWithChannel,
  useRegister,
} from '@/hooks/use-login-request';
import { useSystemConfig } from '@/hooks/use-system-request';
import { rsaPsw } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { Button, ButtonLoading } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FlipCard3D from './card';
import './index.less';

const LOGIN_PATH = '/login';
const REGISTER_PATH = '/inter-register';
const showRegisterEntryOnLogin = false;

const Login = () => {
  const location = useLocation();
  const [title, setTitle] = useState(
    location.pathname === REGISTER_PATH ? 'register' : 'login',
  );
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { channels, loading: channelsLoading } = useLoginChannels();
  const { login: loginWithChannel, loading: loginWithChannelLoading } =
    useLoginWithChannel();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const isLoginPage = title === 'login';

  const loading =
    signLoading ||
    registerLoading ||
    channelsLoading ||
    loginWithChannelLoading;
  const { config } = useSystemConfig();
  const registerEnabled = config?.registerEnabled !== 0;

  useEffect(() => {
    setTitle(location.pathname === REGISTER_PATH ? 'register' : 'login');
  }, [location.pathname]);

  const { isLogin } = useAuth();
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleLoginWithChannel = async (channel: string) => {
    await loginWithChannel(channel);
  };

  const navigateToRegister = () => {
    if (registerEnabled) {
      navigate(REGISTER_PATH);
    }
  };

  const navigateToLogin = () => {
    navigate(LOGIN_PATH);
  };

  const FormSchema = z
    .object({
      nickname: z.string(),
      email: z
        .string()
        .email()
        .min(1, { message: t('emailPlaceholder') }),
      password: z.string().min(1, { message: t('passwordPlaceholder') }),
      remember: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (title === 'register' && !data.nickname) {
        ctx.addIssue({
          path: ['nickname'],
          message: t('nicknamePlaceholder'),
          code: z.ZodIssueCode.custom,
        });
      }
    });
  const form = useForm({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
    },
    resolver: zodResolver(FormSchema),
  });

  const onCheck = async (params: z.infer<typeof FormSchema>) => {
    try {
      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate('/');
        }
      } else {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate(LOGIN_PATH);
        }
      }
    } catch {
      // Request hooks show user-facing errors.
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[url('/login_bg.png')] bg-cover flex flex-col relative overflow-hidden">
        {/* 顶部 Logo 区域 */}
        <div className="absolute top-5 left-14 flex items-center gap-2">
          <img
            src={'/logo_slogan.svg'}
            alt="logo"
            className="h-[40px] w-auto"
          />
        </div>

        <div className="flex flex-row items-center justify-center gap-2 z-10 my-[175px]">
          <img
            src={'/home_logo.png'}
            alt="home_logo"
            className="w-[170px] aspect-[1.37] object-cover"
          />

          <div className="flex flex-row gap-1">
            <img
              src={'/logo_name.svg'}
              alt="海小豹"
              className="inline-block align-baseline h-[36px] w-auto relative"
              // 进阶：align-baseline 对齐文字基线 + top 微调
            />

            <h1 className="text-[clamp(1.1rem,5vw,1.6rem)] font-bold text-gray-800 leading-tight text-center ">
              {t('assistant')}
            </h1>
          </div>
        </div>

        {/* 登录卡片主体 */}
        <div className="absolute flex-col items-center w-full top-[162px]">
          {/* Login Form */}
          <FlipCard3D isLoginPage={isLoginPage}>
            <div className="flex flex-col items-center justify-center w-full">
              <div className=" w-full max-w-[540px] bg-bg-component backdrop-blur-sm rounded-2xl shadow-xl pt-7 pl-10 pr-10 pb-4 border border-border-button ">
                <div className="text-center mb-[25px]">
                  <p className="text-gray-600 text-lg mt-2 max-w-2xl">
                    {title === 'login'
                      ? t('welcomeToLogin')
                      : t('welcomeToSignUp')}
                  </p>
                  <div className="w-6 h-[3px] bg-blue-600 rounded-2xl mx-auto mt-1"></div>
                </div>
                <Form {...form}>
                  <form
                    className="flex flex-col gap-8 text-text-primary "
                    onSubmit={form.handleSubmit(onCheck)}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('emailLabel')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('emailPlaceholder')}
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {title === 'register' && (
                      <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>{t('nicknameLabel')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('nicknamePlaceholder')}
                                autoComplete="username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('passwordLabel')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={'password'}
                                placeholder={t('passwordPlaceholder')}
                                autoComplete={
                                  title === 'login'
                                    ? 'current-password'
                                    : 'new-password'
                                }
                                {...field}
                              />
                              {/* <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </button> */}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {title === 'login' && (
                      <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex gap-2 h-[56px]">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                  }}
                                />
                                <FormLabel
                                  className={cn(' hover:text-text-primary', {
                                    'text-text-disabled': !field.value,
                                    'text-text-primary': field.value,
                                  })}
                                >
                                  {t('rememberMe')}
                                </FormLabel>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <ButtonLoading
                      type="submit"
                      loading={loading}
                      className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-4"
                    >
                      {title === 'login' ? t('login') : t('continue')}
                    </ButtonLoading>
                    {title === 'login' && channels && channels.length > 0 && (
                      <div className="mt-3 border">
                        {channels.map((item) => (
                          <Button
                            variant={'transparent'}
                            key={item.channel}
                            onClick={() => handleLoginWithChannel(item.channel)}
                            style={{ marginTop: 10 }}
                          >
                            <div className="flex items-center">
                              <SvgIcon
                                name={item.icon || 'sso'}
                                width={20}
                                height={20}
                                style={{ marginRight: 5 }}
                              />
                              Sign in with {item.display_name}
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </form>
                </Form>

                {title === 'login' &&
                  registerEnabled &&
                  showRegisterEntryOnLogin && (
                    <div className="mt-3 text-right">
                      <p className="text-text-disabled text-sm">
                        {t('signInTip')}
                        <Button
                          variant={'transparent'}
                          onClick={navigateToRegister}
                          className="text-accent-primary/90 hover:text-blue-600 text-blue-600 hover:underline font-medium border-none"
                        >
                          {t('gotoSignUp')}
                        </Button>
                      </p>
                    </div>
                  )}
                {title === 'register' && (
                  <div className="mt-3 text-right">
                    <p className="text-text-disabled text-sm">
                      {t('signUpTip')}
                      <Button
                        variant={'transparent'}
                        onClick={navigateToLogin}
                        className="text-accent-primary/90 hover:text-blue-600 text-blue-600 hover:underline font-medium border-none"
                      >
                        {t('gotoLogin')}
                      </Button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FlipCard3D>
        </div>
      </div>
    </>
  );
};

export default Login;
