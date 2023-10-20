import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { authService } from '../../app/services/authService';
import { SignupParams } from '../../app/services/authService/signup';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  password: z.string().min(8, 'A senha deve conter 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function useRegisterController() {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: SignupParams) => {
      return authService.signup(data);
    },
  });

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await mutateAsync(data);
    } catch {
      toast.error('Ocorreu um erro ao criar sua conta!');
    }
  });

  return { register, handleSubmit, errors, isPending };
}
