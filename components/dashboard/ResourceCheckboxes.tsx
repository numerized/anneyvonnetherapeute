import { Square } from 'lucide-react'
import React from 'react'

import { TherapyResource } from '@/functions/src/templates/types'

interface ResourceCheckboxesProps {
  resources: TherapyResource[]
}

export function ResourceCheckboxes({ resources }: ResourceCheckboxesProps) {
  if (!resources || resources.length === 0) {
    return null
  }

  // Group resources by type for better organization
  const resourcesByType: Record<string, TherapyResource[]> = {}
  resources.forEach((resource) => {
    if (!resourcesByType[resource.type]) {
      resourcesByType[resource.type] = []
    }
    resourcesByType[resource.type].push(resource)
  })

  // Map of resource types to display names
  const typeLabels: Record<string, string> = {
    test: 'Tests',
    form: 'Formulaires',
    capsule: 'Capsules',
    audio: 'Audio',
    reflection: 'Réflexions',
  }

  return (
    <div className="mt-2 ml-11 space-y-3">
      {Object.entries(resourcesByType).map(([type, typeResources]) => (
        <div key={type} className="space-y-1.5">
          <div className="text-xs text-primary-cream/60 uppercase tracking-wider mb-1">
            {typeLabels[type] || type}
          </div>
          {typeResources.map((resource, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm border border-primary-cream/30 flex items-center justify-center">
                {/* Empty checkbox - not interactive */}
                <Square className="h-3 w-3 text-transparent" />
              </div>
              <span className="text-sm text-primary-cream/70">
                {resource.title}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
