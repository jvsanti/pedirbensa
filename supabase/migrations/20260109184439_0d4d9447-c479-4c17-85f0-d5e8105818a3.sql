-- Tabela de bênçãos
CREATE TABLE public.bencaos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'negado')),
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_resposta TIMESTAMP WITH TIME ZONE
);

-- Tabela de FAQs editáveis
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conteúdo do decreto (seções editáveis)
CREATE TABLE public.decreto_conteudo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  secao TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.bencaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decreto_conteudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role de admin
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas para bencaos (todos podem ver e criar, só admin pode atualizar)
CREATE POLICY "Qualquer um pode ver bênçãos aprovadas/negadas"
ON public.bencaos FOR SELECT
USING (status IN ('aprovado', 'negado'));

CREATE POLICY "Qualquer um pode criar pedido de bênção"
ON public.bencaos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin pode ver todas as bênçãos"
ON public.bencaos FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode atualizar bênçãos"
ON public.bencaos FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode deletar bênçãos"
ON public.bencaos FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para faqs (todos podem ver, só admin pode editar)
CREATE POLICY "Qualquer um pode ver FAQs"
ON public.faqs FOR SELECT
USING (true);

CREATE POLICY "Admin pode inserir FAQs"
ON public.faqs FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode atualizar FAQs"
ON public.faqs FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode deletar FAQs"
ON public.faqs FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para decreto_conteudo (todos podem ver, só admin pode editar)
CREATE POLICY "Qualquer um pode ver conteúdo do decreto"
ON public.decreto_conteudo FOR SELECT
USING (true);

CREATE POLICY "Admin pode inserir conteúdo"
ON public.decreto_conteudo FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode atualizar conteúdo"
ON public.decreto_conteudo FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para user_roles
CREATE POLICY "Usuários podem ver próprio role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Inserir FAQs padrão
INSERT INTO public.faqs (pergunta, resposta, ordem) VALUES
('O que é o Decreto dos Burros?', 'O Decreto dos Burros é o documento sagrado que estabelece a hierarquia suprema do LoL. Quem recebe a bênção está automaticamente acima de qualquer um que questione sua autoridade.', 1),
('Como peço a bênção?', 'Vá até a seção "Pedir Bênção", preencha seu nome e o motivo pelo qual você merece ser abençoado. Aguarde a aprovação do Sumo Sacerdote.', 2),
('E se minha bênção for negada?', 'Se sua bênção foi negada, significa que você ainda não é digno. Reflita sobre seus erros, melhore sua gameplay, e tente novamente quando estiver mais humilde.', 3),
('Posso contestar uma decisão?', 'NÃO. As decisões do Sumo Sacerdote são FINAIS e IRREVOGÁVEIS. Questionar é prova de que você não merece a bênção.', 4),
('A bênção expira?', 'Uma vez abençoado, sempre abençoado. A bênção é eterna e se estende a todas as partidas futuras.', 5);

-- Inserir conteúdo padrão do decreto
INSERT INTO public.decreto_conteudo (secao, titulo, conteudo) VALUES
('hero', 'Decreto dos Burros', 'DECRETO SUPREMO PARA CALAR A BOCA DE QUEM FALA MERDA'),
('dica1', 'Dica de Ofensa #1', 'Se alguém falar mal do seu jungle, mande: "Cala a boca, teu tio"'),
('dica2', 'Dica de Ofensa #2', 'Se questionarem suas calls, responda: "Fala com teu pai, não comigo"'),
('dica3', 'Dica de Ofensa #3', 'Para flamers genéricos: "Vai chorar pro teu tio que eu não sou teu psicólogo"');

-- Enable realtime para bencaos
ALTER PUBLICATION supabase_realtime ADD TABLE public.bencaos;