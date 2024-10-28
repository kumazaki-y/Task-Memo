import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { type AnyObjectSchema } from 'yup';

// 共通のフォーム値のインターフェイス
export interface FormValues {
  email: string;
  [key: string]: unknown;
  password: string;
  passwordConfirmation: string;
  confirmPassword: string;
}

// 共通のバリデーションフック
export const useValidation = <T extends Record<string, unknown>>(
  schema: AnyObjectSchema,
): UseFormReturn<T> => {
  return useForm<T>({
    resolver: yupResolver(schema),
  });
};
