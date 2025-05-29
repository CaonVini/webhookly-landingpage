"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Webhook,
  Shield,
  Eye,
  Zap,
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  RefreshCw,
  Mail,
  Github,
  Twitter,
  User,
  Rocket,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function WebhooklyLanding() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      setMousePosition({ x: touch.clientX, y: touch.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  useEffect(() => {
    // Verificar se já foi enviado anteriormente
    const submitted = localStorage.getItem("webhookly_submitted")
    if (submitted === "true") {
      setAlreadySubmitted(true)
    }
  }, [])

  const saveToFirebase = async (name: string, email: string) => {
    try {
      const docRef = await addDoc(collection(db, "pre_cadastros"), {
        nome: name,
        email: email,
        created_at: new Date(), 
      });
      console.log("Documento salvo com ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Erro ao salvar no Firebase: ", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Se já foi enviado anteriormente, apenas mostrar agradecimento
    if (alreadySubmitted) {
      setIsSubmitted(true)
      return
    }

    setIsLoading(true)

    try {
      // Salvar no Firebase
      const success = await saveToFirebase(name, email)

      if (success) {
        // Marcar como enviado no localStorage
        localStorage.setItem("webhookly_submitted", "true")
        localStorage.setItem("webhookly_user_name", name)
        localStorage.setItem("webhookly_user_email", email)

        setAlreadySubmitted(true)
        setIsSubmitted(true)
      } else {
        // Em caso de erro, mostrar mensagem (você pode personalizar isso)
        alert("Erro ao enviar dados. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro no envio:", error)
      alert("Erro ao enviar dados. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = () => {
    setIsModalOpen(true)

    // Se já foi enviado, ir direto para o agradecimento
    if (alreadySubmitted) {
      const savedName = localStorage.getItem("webhookly_user_name") || "usuário"
      setName(savedName)
      setIsSubmitted(true)
    }
  }

  const openDocModal = () => {
    setIsDocModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    if (!alreadySubmitted) {
      setIsSubmitted(false)
      setEmail("")
      setName("")
    }
  }

  return (
    <div className="relative">
      {/* Fixed Parallax Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div
          className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-white overflow-x-hidden">
        {/* Modal de Pré-cadastro */}
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white max-w-sm sm:max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                {isSubmitted ? "Acesso Garantido!" : "Garantir Acesso Antecipado"}
              </DialogTitle>
            </DialogHeader>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 py-3 rounded-xl focus:border-green-500 focus:ring-green-500 disabled:opacity-50"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 py-3 rounded-xl focus:border-green-500 focus:ring-green-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Garantir Meu Acesso
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-gray-400 text-sm text-center">
                  Foco na relevância: Enviaremos somente atualizações importantes sobre o lançamento do Webhookly.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Obrigado, {name}!</h3>
                <p className="text-gray-300 text-lg mb-4">
                  {alreadySubmitted && !isLoading
                    ? "Você já está na nossa lista de acesso antecipado!"
                    : "Seu pré-cadastro foi confirmado com sucesso."}
                </p>
                <p className="text-gray-400">
                  Você receberá um email quando o Webhookly estiver disponível, além do seu{" "}
                  <span className="text-green-400 font-semibold">cupom de 30% de desconto</span>!
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Documentação */}
        <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white max-w-sm sm:max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Em Desenvolvimento
              </DialogTitle>
            </DialogHeader>

            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                Nossa documentação está sendo preparada. Mas, não se preocupe: o design intuitivo do Webhookly tornará a
                integração uma tarefa simples.
              </p>

              <Button
                onClick={openModal}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="mr-2 w-5 h-5" />
                Quero ser o primeiro a testar!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-screen py-16 md:py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 md:mb-8 leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                  NUNCA MAIS PERCA
                </span>
                <span className="block bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                  UM WEBHOOK
                </span>
              </h1>

              <div className="max-w-4xl mx-auto mb-8 md:mb-12">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 md:mb-6 leading-relaxed font-light">
                  O proxy inteligente que <span className="text-green-400 font-semibold">intercepta</span>,{" "}
                  <span className="text-green-400 font-semibold">registra</span> e{" "}
                  <span className="text-green-400 font-semibold">entrega</span> todos os seus webhooks
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light">
                  Construído para desenvolvedores que não aceitam perder dados críticos
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8">
              <Button
                onClick={openModal}
                size="lg"
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {alreadySubmitted ? "Ver Meu Cadastro" : "Garantir Acesso Antecipado"}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              <Button
                onClick={openDocModal}
                variant="outline"
                size="lg"
                className="border-2 border-gray-600 hover:border-green-500 text-gray-300 hover:text-green-400 bg-transparent hover:bg-green-500/10 px-6 sm:px-8 md:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Code className="mr-3 w-6 h-6" />
                Ver Documentação
              </Button>
            </div>

            {/* Bonus Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 backdrop-blur-sm">
              <Rocket className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-sm sm:text-base md:text-lg text-green-300 font-semibold">
                Pré-Cadastre-se e economize<span className="text-green-400"> 30%</span> na primeira assinatura
              </span>
            </div>
          </div>
        </section>

        {/* Seção O Problema */}
        <section
          id="problema"
          className="min-h-screen py-16 md:py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Você já perdeu webhooks críticos?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Sabemos a frustração de lidar com integrações instáveis e dados perdidos
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-gray-900/50 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
                <CardContent className="p-6 md:p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/25">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Webhooks Perdidos</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Falhas de rede, timeouts e indisponibilidade fazem você perder eventos críticos para sua aplicação.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
                <CardContent className="p-6 md:p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Falta de Visibilidade</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Sem logs detalhados, é impossível debuggar problemas ou entender o que aconteceu com seus webhooks.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
                <CardContent className="p-6 md:p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/25">
                    <RefreshCw className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Reenvios Manuais</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Quando algo falha, você precisa implementar lógica complexa de retry ou fazer reenvios manuais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção A Solução */}
        <section
          id="solucao"
          className="min-h-screen py-16 md:py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                A Solução:{" "}
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Webhookly
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Um proxy inteligente que intercepta todos os webhooks antes de chegarem à sua aplicação, garantindo
                captura, logging e entrega confiável.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/25">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Captura Garantida</h3>
                <p className="text-gray-400 leading-relaxed">
                  Todos os webhooks são interceptados e armazenados, mesmo se sua aplicação estiver offline.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/25">
                  <Database className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Logs Detalhados</h3>
                <p className="text-gray-400 leading-relaxed">
                  Visualize todos os eventos, payloads, headers e status de entrega em tempo real.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/25">
                  <RefreshCw className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Reenvio Inteligente</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sistema automático de retry com backoff exponencial e reenvio manual quando necessário.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/25">
                  <Code className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Integração Zero</h3>
                <p className="text-gray-400 leading-relaxed">
                  Basta trocar a URL do webhook. Sem mudanças no código da sua aplicação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Como Vai Funcionar */}
        <section
          id="como-funciona"
          className="min-h-screen py-16 md:py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
                Como Vai Funcionar?
              </h2>
              <p className="text-lg md:text-xl text-gray-400">Simples como trocar uma URL</p>
            </div>

            <div className="space-y-10 md:space-y-12">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Configure seu Endpoint</h3>
                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                    Crie um endpoint no Webhookly e configure a URL de destino da sua aplicação.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Atualize suas Integrações</h3>
                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                    Substitua a URL do webhook nas suas integrações pela URL do Webhookly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Monitore e Controle</h3>
                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                    Acompanhe todos os eventos em tempo real, visualize logs e reenvie quando necessário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Captura de Email */}
        <section
          id="cadastro"
          className="min-h-screen py-16 md:py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              onClick={openModal}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Seja o Primeiro a Usar o Webhookly
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Cadastre-se agora e receba acesso prioritário quando lançarmos, além de{" "}
              <strong className="text-green-400">
                um cupom de 30% de desconto na primeira assinatura em qualquer plano
              </strong>{" "}
              para testar todas as funcionalidades.
            </p>

            <div className="flex flex-col items-center space-y-8">
              <Button
                onClick={openModal}
                size="lg"
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {alreadySubmitted ? "Ver Meu Cadastro" : "Garantir Acesso Antecipado"}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 backdrop-blur-sm">
                <Rocket className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-sm sm:text-base md:text-lg text-green-300 font-semibold">
                  Pré-Cadastre-se e economize<span className="text-green-400"> 30%</span> na primeira assinatura
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Webhookly
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0">
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Política de Privacidade
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Termos de Serviço
                </Link>
              </div>

              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors hover:scale-110 transform"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors hover:scale-110 transform"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors hover:scale-110 transform"
                >
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-800/50 mt-6 pt-6 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Webhookly. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
