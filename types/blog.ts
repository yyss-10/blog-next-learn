export type Blogs = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  title: string
  body: string
  category: Categorys
  tag: Tags
}

export type Categorys = {
  createdAt: string
  id: string
  name: string
  publishedAt: string
  revisedAt: string
  updatedAt: string
}

export type Tags = {
  createdAt: string
  id: string
  name: string
  publishedAt: string
  revisedAt: string
  updatedAt: string
}
