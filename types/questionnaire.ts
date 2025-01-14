export type QuestionnaireFieldType = 'text' | 'textarea' | 'range' | 'radio' | 'checkbox' | 'mixed'

export interface QuestionnaireField {
  id: string
  type: QuestionnaireFieldType
  title: string
  description: string
  hint?: string
  defaultValue: string
  placeholderValue?: string
  min?: string
  max?: string
  options?: Array<{
    label: string
    value: string
  }>
}

export interface QuestionnaireStep {
  id: string
  type: QuestionnaireFieldType
  title: string
  description: string
  quote?: string
  fields: QuestionnaireField[]
}

export interface Questionnaire {
  id: string
  title: string
  description: string
  steps: QuestionnaireStep[]
}
