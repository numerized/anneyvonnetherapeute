'use client'

import { useState } from 'react'

interface QuestionnaireObligatoireProps {
  onPrevious: () => void
}

export function QuestionnaireObligatoire({ onPrevious }: QuestionnaireObligatoireProps) {
  const [mustBe, setMustBe] = useState(['', '', '', ''])
  const [cannotBe, setCannotBe] = useState(['', '', '', ''])
  const [experiences, setExperiences] = useState(['', '', ''])
  const [forbidden, setForbidden] = useState(['', '', '', ''])
  const [consequences, setConsequences] = useState(['', '', ''])
  const [influences, setInfluences] = useState(['', '', ''])
  const [currentBehaviors, setCurrentBehaviors] = useState(['', '', ''])
  const [limitations, setLimitations] = useState(['', '', ''])
  const [liberation, setLiberation] = useState(['', '', ''])
  const [understanding, setUnderstanding] = useState('')
  const [changeDesired, setChangeDesired] = useState('')

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Formulaire de réflexion : "Mes Obligatoires" et "Mes Interdits"
      </h1>
      
      <p className="text-gray-600 mb-8 italic">
        Ce formulaire vous invite à explorer vos croyances profondes liées à l'amour et à l'acceptation, 
        souvent issues de vos schémas parentaux et sociaux. Prenez le temps d'y répondre sincèrement pour 
        identifier les attentes et les blocages qui peuvent influencer votre relation.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">1. Mes "Obligatoires"</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Je dois toujours être...</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : fort(e), parfait(e), drôle, gentil(le), indépendant(e))</p>
          {mustBe.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...mustBe]
                newItems[index] = e.target.value
                setMustBe(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Je ne peux jamais être...</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : faible, en colère, exigeant(e), dépendant(e))</p>
          {cannotBe.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...cannotBe]
                newItems[index] = e.target.value
                setCannotBe(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">De quelles expériences ces "obligations" pourraient-elles provenir ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : "Mon père me disait toujours que..." ou "À l'école, on m'a appris que...")</p>
          {experiences.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...experiences]
                newItems[index] = e.target.value
                setExperiences(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">2. Mes "Interdits"</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Je ne dois jamais...</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : échouer, dire non, montrer mes émotions, prendre trop de place)</p>
          {forbidden.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...forbidden]
                newItems[index] = e.target.value
                setForbidden(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Si je transgresse ces interdits, que crois-je qu'il se passera ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : "Je serai rejeté(e)", "On m'abandonnera", "On me jugera")</p>
          {consequences.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...consequences]
                newItems[index] = e.target.value
                setConsequences(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Ces croyances viennent-elles d'un événement, d'une relation ou d'un modèle précis ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : "Quand j'étais enfant, ma mère disait que..." ou "La société valorise toujours...")</p>
          {influences.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...influences]
                newItems[index] = e.target.value
                setInfluences(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">3. Réflexion sur l'impact de ces schémas</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Quels "obligatoires" influencent mes comportements dans cette relation ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : "Je me force à toujours être de bonne humeur avec mon/ma partenaire.")</p>
          {currentBehaviors.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...currentBehaviors]
                newItems[index] = e.target.value
                setCurrentBehaviors(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Quels "interdits" limitent ma capacité à être moi-même dans cette relation ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : "Je n'ose pas montrer mes vulnérabilités.")</p>
          {limitations.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...limitations]
                newItems[index] = e.target.value
                setLimitations(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Comment pourrais-je commencer à me libérer de ces schémas ?</h3>
          <p className="text-sm text-gray-500 italic mb-4">(Exemple : en identifiant mes besoins authentiques, en exprimant mes émotions, etc.)</p>
          {liberation.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...liberation]
                newItems[index] = e.target.value
                setLiberation(newItems)
              }}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none mb-4"
              placeholder="Votre réponse..."
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">4. Mes premières prises de conscience</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Une chose que j'ai comprise sur moi-même grâce à cette séance :</h3>
          <textarea
            value={understanding}
            onChange={(e) => setUnderstanding(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[100px] resize-none"
            placeholder="Votre réponse..."
          />
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Une chose que j'aimerais changer ou explorer davantage dans mes relations :</h3>
          <textarea
            value={changeDesired}
            onChange={(e) => setChangeDesired(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[100px] resize-none"
            placeholder="Votre réponse..."
          />
        </div>
      </section>

      <p className="text-sm text-gray-500 italic mb-8">
        Ce formulaire est un outil pour continuer votre travail de conscientisation. 
        Revenez-y régulièrement pour observer l'évolution de vos perceptions et croyances.
      </p>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          Précédent
        </button>
        <button
          onClick={() => {
            // Handle save or submission
            alert('Vos réponses ont été enregistrées')
          }}
          className="bg-primary-coral text-white px-6 py-2 rounded-full hover:bg-primary-rust transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
