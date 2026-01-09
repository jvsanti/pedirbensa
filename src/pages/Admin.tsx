import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, LogOut, Check, X, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import { User, Session } from '@supabase/supabase-js';

interface Bencao {
  id: string;
  nome: string;
  motivo: string;
  status: string;
  data_envio: string;
}

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface DecretoConteudo {
  id: string;
  secao: string;
  titulo: string;
  conteudo: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bencaos' | 'faqs' | 'decreto'>('bencaos');

  const [bencaos, setBencaos] = useState<Bencao[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [decretoConteudo, setDecretoConteudo] = useState<DecretoConteudo[]>([]);

  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [editingDecreto, setEditingDecreto] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({ pergunta: '', resposta: '' });
  const [showNewFaq, setShowNewFaq] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/auth');
      } else {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/auth');
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (data) {
      setIsAdmin(true);
      loadData();
    } else {
      setIsAdmin(false);
      toast.error('Você não tem permissão de admin. Contate o administrador.');
    }
    setLoading(false);
  };

  const loadData = async () => {
    const [bencaosRes, faqsRes, decretoRes] = await Promise.all([
      supabase.from('bencaos').select('*').order('data_envio', { ascending: false }),
      supabase.from('faqs').select('*').order('ordem'),
      supabase.from('decreto_conteudo').select('*'),
    ]);

    if (bencaosRes.data) setBencaos(bencaosRes.data);
    if (faqsRes.data) setFaqs(faqsRes.data);
    if (decretoRes.data) setDecretoConteudo(decretoRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDecisao = async (id: string, status: 'aprovado' | 'negado') => {
    const { error } = await supabase
      .from('bencaos')
      .update({ status, data_resposta: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar bênção');
    } else {
      toast.success(status === 'aprovado' ? 'Bênção concedida!' : 'Bênção negada!');
      loadData();
    }
  };

  const handleDeleteBencao = async (id: string) => {
    const { error } = await supabase.from('bencaos').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar');
    } else {
      toast.success('Bênção removida');
      loadData();
    }
  };

  const handleSaveFaq = async (faq: FAQ) => {
    const { error } = await supabase
      .from('faqs')
      .update({ pergunta: faq.pergunta, resposta: faq.resposta })
      .eq('id', faq.id);

    if (error) {
      toast.error('Erro ao salvar FAQ');
    } else {
      toast.success('FAQ atualizada!');
      setEditingFaq(null);
      loadData();
    }
  };

  const handleAddFaq = async () => {
    if (!newFaq.pergunta || !newFaq.resposta) {
      toast.error('Preencha todos os campos');
      return;
    }

    const { error } = await supabase.from('faqs').insert({
      pergunta: newFaq.pergunta,
      resposta: newFaq.resposta,
      ordem: faqs.length + 1,
    });

    if (error) {
      toast.error('Erro ao adicionar FAQ');
    } else {
      toast.success('FAQ adicionada!');
      setNewFaq({ pergunta: '', resposta: '' });
      setShowNewFaq(false);
      loadData();
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar FAQ');
    } else {
      toast.success('FAQ removida');
      loadData();
    }
  };

  const handleSaveDecreto = async (item: DecretoConteudo) => {
    const { error } = await supabase
      .from('decreto_conteudo')
      .update({ titulo: item.titulo, conteudo: item.conteudo })
      .eq('id', item.id);

    if (error) {
      toast.error('Erro ao salvar conteúdo');
    } else {
      toast.success('Conteúdo atualizado!');
      setEditingDecreto(null);
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-decree rounded-2xl p-8 text-center max-w-md">
          <Crown className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground font-body mb-6">
            Você não tem permissão de administrador. Contate o dono do site para receber o cargo.
          </p>
          <button
            onClick={handleLogout}
            className="btn-decree px-6 py-3 rounded-lg font-display text-primary-foreground"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  const pendentes = bencaos.filter(b => b.status === 'pendente');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl">
              Painel <span className="text-gradient">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">
              Ver site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 border-b border-border">
          {(['bencaos', 'faqs', 'decreto'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-display text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'bencaos' ? `Bênçãos (${pendentes.length})` : tab === 'faqs' ? 'FAQs' : 'Decreto'}
            </button>
          ))}
        </div>

        {activeTab === 'bencaos' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Pedidos Pendentes</h2>
            {pendentes.length === 0 ? (
              <p className="text-muted-foreground italic">Nenhum pedido pendente.</p>
            ) : (
              <div className="grid gap-4">
                {pendentes.map((b) => (
                  <div key={b.id} className="card-decree rounded-xl p-4 flex justify-between items-start gap-4">
                    <div>
                      <p className="font-display text-foreground">{b.nome}</p>
                      <p className="text-sm text-muted-foreground font-body">{b.motivo}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(b.data_envio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecisao(b.id, 'aprovado')}
                        className="w-10 h-10 rounded-full bg-success/20 hover:bg-success/30 flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-success" />
                      </button>
                      <button
                        onClick={() => handleDecisao(b.id, 'negado')}
                        className="w-10 h-10 rounded-full bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                      >
                        <X className="w-5 h-5 text-destructive" />
                      </button>
                      <button
                        onClick={() => handleDeleteBencao(b.id)}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-display text-xl mt-8">Histórico</h2>
            <div className="grid gap-2">
              {bencaos.filter(b => b.status !== 'pendente').map((b) => (
                <div key={b.id} className="card-decree rounded-lg p-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    {b.status === 'aprovado' ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-destructive" />
                    )}
                    <span className="font-display">{b.nome}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBencao(b.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl">FAQs</h2>
              <button
                onClick={() => setShowNewFaq(true)}
                className="btn-decree px-4 py-2 rounded-lg font-display text-sm flex items-center gap-2 text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {showNewFaq && (
              <div className="card-decree rounded-xl p-4 space-y-3">
                <input
                  type="text"
                  value={newFaq.pergunta}
                  onChange={(e) => setNewFaq({ ...newFaq, pergunta: e.target.value })}
                  placeholder="Pergunta..."
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground"
                />
                <textarea
                  value={newFaq.resposta}
                  onChange={(e) => setNewFaq({ ...newFaq, resposta: e.target.value })}
                  placeholder="Resposta..."
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFaq}
                    className="btn-decree px-4 py-2 rounded-lg font-display text-sm text-primary-foreground"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setShowNewFaq(false)}
                    className="px-4 py-2 rounded-lg font-display text-sm text-muted-foreground"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {faqs.map((faq) => (
              <div key={faq.id} className="card-decree rounded-xl p-4">
                {editingFaq === faq.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={faq.pergunta}
                      onChange={(e) => setFaqs(faqs.map(f => f.id === faq.id ? { ...f, pergunta: e.target.value } : f))}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground"
                    />
                    <textarea
                      value={faq.resposta}
                      onChange={(e) => setFaqs(faqs.map(f => f.id === faq.id ? { ...f, resposta: e.target.value } : f))}
                      rows={3}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveFaq(faq)}
                        className="btn-decree px-4 py-2 rounded-lg font-display text-sm flex items-center gap-2 text-primary-foreground"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                      <button
                        onClick={() => { setEditingFaq(null); loadData(); }}
                        className="px-4 py-2 rounded-lg font-display text-sm text-muted-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-display text-foreground">{faq.pergunta}</p>
                      <p className="text-sm text-muted-foreground font-body mt-1">{faq.resposta}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingFaq(faq.id)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'decreto' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Conteúdo do Decreto</h2>
            {decretoConteudo.map((item) => (
              <div key={item.id} className="card-decree rounded-xl p-4">
                {editingDecreto === item.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.titulo}
                      onChange={(e) => setDecretoConteudo(decretoConteudo.map(d => d.id === item.id ? { ...d, titulo: e.target.value } : d))}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground"
                    />
                    <textarea
                      value={item.conteudo}
                      onChange={(e) => setDecretoConteudo(decretoConteudo.map(d => d.id === item.id ? { ...d, conteudo: e.target.value } : d))}
                      rows={4}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 font-body text-foreground resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveDecreto(item)}
                        className="btn-decree px-4 py-2 rounded-lg font-display text-sm flex items-center gap-2 text-primary-foreground"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                      <button
                        onClick={() => { setEditingDecreto(null); loadData(); }}
                        className="px-4 py-2 rounded-lg font-display text-sm text-muted-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.secao}</p>
                      <p className="font-display text-foreground">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground font-body mt-1">{item.conteudo}</p>
                    </div>
                    <button
                      onClick={() => setEditingDecreto(item.id)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
