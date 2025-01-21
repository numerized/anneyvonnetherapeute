'use client'

import { useState } from 'react'
import { RangeInput } from '@/components/ui/RangeInput'

export default function EvaluationHandicapRelationnelPage() {
  const [values, setValues] = useState<{ [key: string]: number }>({})

  const handleChange = (id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  return (
    <div className="min-h-screen bg-primary-green p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold mb-6">Évaluation des Relations Sociales</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Autonomie décisionnelle</h3>
            <RangeInput
              id="autonomie_decisionnelle"
              value={values.autonomie_decisionnelle || 5}
              onChange={(value) => handleChange('autonomie_decisionnelle', value)}
              min={0}
              max={10}
              minLabel="Je suis incapable de prendre des décisions sans l'aval des autres."
              maxLabel="Je prends toutes mes décisions de manière totalement indépendante."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Gestion du temps personnel</h3>
            <RangeInput
              id="gestion_temps"
              value={values.gestion_temps || 5}
              onChange={(value) => handleChange('gestion_temps', value)}
              min={0}
              max={10}
              minLabel="Je consacre tout mon temps aux autres, sans moments pour moi."
              maxLabel="Je gère mon temps de manière totalement indépendante."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Expression des opinions personnelles</h3>
            <RangeInput
              id="expression_opinions"
              value={values.expression_opinions || 5}
              onChange={(value) => handleChange('expression_opinions', value)}
              min={0}
              max={10}
              minLabel="Je n'exprime jamais mes opinions par peur de déplaire."
              maxLabel="J'exprime toujours mes opinions, sans tenir compte de l'impact sur les autres."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Capacité à établir des limites</h3>
            <RangeInput
              id="limites"
              value={values.limites || 5}
              onChange={(value) => handleChange('limites', value)}
              min={0}
              max={10}
              minLabel="Je suis incapable de dire non ou d'établir des limites dans mes relations."
              maxLabel="J'établis des limites strictes dans toutes mes interactions, sans flexibilité."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Gestion de la solitude</h3>
            <RangeInput
              id="solitude"
              value={values.solitude || 5}
              onChange={(value) => handleChange('solitude', value)}
              min={0}
              max={10}
              minLabel="Je suis incapable de rester seul, même pour de courtes périodes."
              maxLabel="Je préfère toujours être seul et évite toute interaction sociale."
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 mt-12">Évaluation des Relations Intimes</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Autonomie dans la relation</h3>
            <RangeInput
              id="autonomie_relation"
              value={values.autonomie_relation || 5}
              onChange={(value) => handleChange('autonomie_relation', value)}
              min={0}
              max={10}
              minLabel="Je suis incapable de prendre des décisions sans l'avis de mon/mes partenaire(s)."
              maxLabel="Je prends toutes mes décisions sans tenir compte de l'avis de l'autre."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Gestion du temps partagé</h3>
            <RangeInput
              id="temps_partage"
              value={values.temps_partage || 5}
              onChange={(value) => handleChange('temps_partage', value)}
              min={0}
              max={10}
              minLabel="Je consacre tout mon temps à mon/mes partenaire(s), sans moment pour moi."
              maxLabel="Je privilégie toujours mon propre emploi du temps."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Expression des besoins émotionnels</h3>
            <RangeInput
              id="besoins_emotionnels"
              value={values.besoins_emotionnels || 5}
              onChange={(value) => handleChange('besoins_emotionnels', value)}
              min={0}
              max={10}
              minLabel="Je n'exprime jamais mes besoins émotionnels par peur d'être rejeté(e)."
              maxLabel="J'exprime mes besoins sans prendre en compte les limites de l'autre."
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Limites dans la relation</h3>
            <RangeInput
              id="limites_relation"
              value={values.limites_relation || 5}
              onChange={(value) => handleChange('limites_relation', value)}
              min={0}
              max={10}
              minLabel="Je suis incapable de poser des limites avec mon/mes partenaire(s)."
              maxLabel="Je pose des limites strictes et inflexibles, sans compromis."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
