import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authService } from '../../app/services/authService';

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

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    const { accessToken } = await authService.signup(data);

    console.log(accessToken);
  });

  return { register, handleSubmit, errors };
}
