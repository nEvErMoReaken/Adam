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
