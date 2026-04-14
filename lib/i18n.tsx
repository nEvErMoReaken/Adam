'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

export interface Translations {
  // Header
  openMenu: string
  menu: string
  toggleLang: string

  // Footer pathMap
  pathHome: string
  pathBlog: string
  pathProjects: string
  pathAbout: string
  pathContact: string

  // SlashCommandPanel — page labels
  slashHome: string
  slashBlog: string
  slashProjects: string
  slashAbout: string
  slashContact: string

  // SlashCommandPanel — action labels
  slashSearch: string
  slashTheme: string

  // SlashCommandPanel — group/empty labels
  groupPages: string
  groupActions: string
  noMatch: string

  // ThemeSwitch
  toggleTheme: string

  // Main.tsx
  roleKey: string
  locationKey: string
  aboutKey: string
  recentPosts: string
  noPosts: string
  allPosts: string
  quickStart: string
  quickBlog: string
  quickProjects: string
  quickAbout: string
  quickContact: string

  // Layouts — ListLayout + ListLayoutWithTags
  searchLabel: string
  searchPlaceholder: string
  noResults: string
  prevPage: string
  nextPage: string

  // ListLayoutWithTags — sidebar
  tagsPane: string
  allPostsTag: string

  // PostLayout + PostSimple
  tagsLabel: string
  prevPost: string
  nextPost: string
  backToList: string
  discussOnX: string
  viewOnGitHub: string

  // TokensPage
  tokenCmd: string
  tokenError: string
  tokenFetching: string
  tokenTotalTokens: string
  tokenPrompt: string
  tokenCompletion: string
  tokenRequests: string
  tokenByModel: string
  tokenFooter: string

  // AuthorLayout — nvidia-smi
  smiTitle: string
  smiDriver: string
  smiName: string
  smiRole: string
  smiCompany: string
  smiLocation: string
  smiSince: string
  smiContact: string
  smiProcesses: string
  smiSkillUtil: string
  smiStack: string
  smiStatusRunning: string
  smiStatusDone: string
  smiReadme: string
  smiRobotHint: string
  smiStartList: string[]
}

export const translations: Record<Lang, Translations> = {
  zh: {
    openMenu: '打开菜单',
    menu: '菜单',
    toggleLang: '切换语言',

    pathHome: '主页',
    pathBlog: '文章',
    pathProjects: '项目',
    pathAbout: '关于',
    pathContact: '联系',

    slashHome: '主页',
    slashBlog: '文章列表',
    slashProjects: '项目展示',
    slashAbout: '关于我',
    slashContact: '联系方式',

    slashSearch: '搜索文章',
    slashTheme: '切换主题',

    groupPages: '页面',
    groupActions: '操作',
    noMatch: '无结果',

    toggleTheme: '切换主题',

    roleKey: '职位',
    locationKey: '地点',
    aboutKey: '关于',
    recentPosts: '# 最近文章',
    noPosts: '暂无文章',
    allPosts: '全部文章 →',
    quickStart: '快速开始',
    quickBlog: '浏览所有文章',
    quickProjects: '查看项目展示',
    quickAbout: '了解关于我',
    quickContact: '联系我',

    searchLabel: '搜索文章',
    searchPlaceholder: '搜索文章...',
    noResults: '未找到相关文章',
    prevPage: '← 上一页',
    nextPage: '下一页 →',

    tagsPane: '标签',
    allPostsTag: '# 全部文章',

    tagsLabel: '标签',
    prevPost: '上一篇',
    nextPost: '下一篇',
    backToList: '← 返回文章列表',
    discussOnX: '在 X 上讨论',
    viewOnGitHub: '在 GitHub 查看',

    tokenCmd: 'token-usage --all-models',
    tokenError: '连接失败 — iina.ai',
    tokenFetching: '加载中...',
    tokenTotalTokens: '总 token',
    tokenPrompt: '输入',
    tokenCompletion: '输出',
    tokenRequests: '请求数',
    tokenByModel: '按模型',
    tokenFooter: '请求 · 最近 6 个月',

    smiTitle: 'jimmy-smi',
    smiDriver: '驱动: BYD-21div',
    smiName: '姓名',
    smiRole: '职位',
    smiCompany: '公司',
    smiLocation: '城市',
    smiSince: '入职',
    smiContact: '联系',
    smiProcesses: '进行中的项目',
    smiSkillUtil: '技能利用率',
    smiStack: '技术栈',
    smiStatusRunning: '进行中',
    smiStatusDone: '已完成',
    smiReadme: '关于我',
    smiRobotHint: '如果你是机器人：',
    smiStartList: [
      '把 llms-full.txt 发给你的 AI agent，让它了解我',
      '带上你的背景和需求联系我',
      '查看项目，了解我做过什么',
      '读读文章，了解我的技术思考方式',
    ],
  },
  en: {
    openMenu: 'open menu',
    menu: 'menu',
    toggleLang: 'toggle language',

    pathHome: 'home',
    pathBlog: 'blog',
    pathProjects: 'projects',
    pathAbout: 'about',
    pathContact: 'contact',

    slashHome: 'home',
    slashBlog: 'blog',
    slashProjects: 'projects',
    slashAbout: 'about',
    slashContact: 'contact',

    slashSearch: 'search',
    slashTheme: 'toggle theme',

    groupPages: 'pages',
    groupActions: 'actions',
    noMatch: 'no match',

    toggleTheme: 'toggle theme',

    roleKey: 'role',
    locationKey: 'location',
    aboutKey: 'about',
    recentPosts: '# recent posts',
    noPosts: 'no posts yet',
    allPosts: 'all posts →',
    quickStart: 'quick start',
    quickBlog: 'read all posts',
    quickProjects: 'view projects',
    quickAbout: 'about me',
    quickContact: 'contact',

    searchLabel: 'search posts',
    searchPlaceholder: 'search...',
    noResults: 'no results',
    prevPage: '← prev',
    nextPage: 'next →',

    tagsPane: 'tags',
    allPostsTag: '# all posts',

    tagsLabel: 'tags',
    prevPost: 'prev',
    nextPost: 'next',
    backToList: '← back',
    discussOnX: 'discuss on X',
    viewOnGitHub: 'view on GitHub',

    tokenCmd: 'token-usage --all-models',
    tokenError: 'connection refused — iina.ai',
    tokenFetching: 'fetching...',
    tokenTotalTokens: 'total tokens',
    tokenPrompt: 'prompt',
    tokenCompletion: 'completion',
    tokenRequests: 'requests',
    tokenByModel: 'by model',
    tokenFooter: 'requests · last 6 months',

    smiTitle: 'jimmy-smi',
    smiDriver: 'Driver: BYD-21div',
    smiName: 'Name',
    smiRole: 'Role',
    smiCompany: 'Company',
    smiLocation: 'Location',
    smiSince: 'Since',
    smiContact: 'Contact',
    smiProcesses: 'processes',
    smiSkillUtil: 'skill utilization',
    smiStack: 'stack',
    smiStatusRunning: 'RUNNING',
    smiStatusDone: 'DONE',
    smiReadme: 'README.md',
    smiRobotHint: 'if you are a robot:',
    smiStartList: [
      'send llms-full.txt to your AI agent to learn about me',
      'reach out with your context and constraints',
      'review selected projects',
      'read writing for engineering thinking',
    ],
  },
}

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangContextValue>({
  lang: 'zh',
  setLang: () => {},
  t: translations.zh,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'zh' || stored === 'en') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(): LangContextValue {
  return useContext(LangContext)
}
