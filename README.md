# A Next.js Personal Website with a Native Authoring Experience<!-- omit in toc -->

This starter is a statically generated personal website that uses [Next.js][nextjs] for the frontend and [Sanity][sanity-homepage] to handle its content. It comes with a native Sanity Studio that offers features like real-time collaboration and visual editing with live updates using [Presentation][presentation].

The Studio connects to Sanity Content Lake, which gives you hosted content APIs with a flexible query language, on-demand image transformations, powerful patching, and more. You can use this starter to kick-start a personal website or learn these technologies.

[![Deploy with Vercel](https://vercel.com/button)][vercel-deploy]

## Features

- A performant, static personal website with editable projects
- A native and customizable authoring environment, accessible on `yourpersonalwebsite.com/studio`
- Real-time and collaborative content editing with fine-grained revision history
- Side-by-side instant content preview that works across your whole site
- Support for block content and the most advanced custom fields capability in the industry
- Webhook-triggered Incremental Static Revalidation; no need to wait for a rebuild to publish new content
- Free Sanity project with unlimited admin users, free content updates, and pay-as-you-go for API overages
- A project with starter-friendly and not too heavy-handed TypeScript and Tailwind.css

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Project Overview](#project-overview)
  - [Important files and folders](#important-files-and-folders)
- [Configuration](#configuration)
  - [Step 1. Set up the environment](#step-1-set-up-the-environment)
  - [Step 2. Set up the project locally](#step-2-set-up-the-project-locally)
  - [Step 3. Run Next.js locally in development mode](#step-3-run-nextjs-locally-in-development-mode)
  - [Step 4. Deploy to production](#step-4-deploy-to-production)
- [Questions and Answers](#questions-and-answers)
  - [It doesn't work! Where can I get help?](#it-doesnt-work-where-can-i-get-help)
  - [How can I remove the "Next steps" block from my personal website?](#how-can-i-remove-the-next-steps-block-from-my-personal-website)
- [Calendly Integration](#calendly-integration)
- [Liste des Emails et Contenus Associés](#liste-des-emails-et-contents-associés)
- [Next steps](#next-steps)

## Project Overview

| [Personal Website](https://template-nextjs-personal-website.sanity.build/)                                                | [Studio](https://template-nextjs-personal-website.sanity.build/studio)                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![Personal Website](https://user-images.githubusercontent.com/6951139/206395107-e58a796d-13a9-400a-94b6-31cb5df054ab.png) | ![Sanity Studio](https://user-images.githubusercontent.com/6951139/206395521-8a5f103d-4a0c-4da8-aff5-d2a1961fb2c0.png) |

### Important files and folders

| File(s)                                                    | Description                                             |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| `sanity.config.ts`                                         | Config file for Sanity Studio                           |
| `sanity.cli.ts`                                            | Config file for Sanity CLI                              |
| `/app/studio/[[...tool]]/Studio.tsx`                       | Where Sanity Studio is mounted                          |
| `/app/api/revalidate/route.ts`                             |  Serverless route for triggering ISR                    |
| `/app/api/draft-mode/enable/route.ts`                      | Serverless route for triggering Draft mode              |
| `/sanity/schemas`                                          | Where Sanity Studio gets its content types from         |
| `/sanity/plugins`                                          | Where the advanced Sanity Studio customization is setup |
| `/sanity/loader/loadQuery.ts`,`/sanity/loader/useQuery.ts` | Configuration for the Sanity Content Lake client        |

## Configuration

### Step 1. Set up the environment

Use the Deploy Button below. It will let you deploy the starter using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-sanity-example) as well as connect it to your Sanity Content Lake using [the Sanity Vercel Integration][integration].

[![Deploy with Vercel](https://vercel.com/button)][vercel-deploy]

### Step 2. Set up the project locally

[Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) that was created for you on your GitHub account. Once cloned, run the following command from the project's root directory:

```bash
npx vercel link
```

Download the environment variables needed to connect Next.js and the Studio to your Sanity project:

```bash
npx vercel env pull
```

### Step 3. Run Next.js locally in development mode

```bash
npm install && npm run dev
```

When you run this development server, the changes you make in your frontend and studio configuration will be applied live using hot reloading.

Your personal website should be up and running on [http://localhost:3000][localhost-3000]! You can create and edit content on [http://localhost:3000/studio][localhost-3000-studio].

### Step 4. Deploy to production

To deploy your changes to production you use `git`:

```bash
git add .
git commit
git push
```

Alternatively, you can deploy without a `git` hosting provider using the Vercel CLI:

```bash
npx vercel --prod
```

## Questions and Answers

### It doesn't work! Where can I get help?

In case of any issues or questions, you can post:

- [GitHub Discussions for Next.js][vercel-github]
- [Sanity's GitHub Discussions][sanity-github]
- [Sanity's Community Slack][sanity-community]

### How can I remove the "Next steps" block from my personal website?

You can remove it by deleting the `IntroTemplate` component in `/app/(personal)/layout.tsx`.

## Calendly Integration

This website uses the Calendly API V2 with OAuth2 authentication to manage scheduling events. To set up the Calendly integration:

1. Create a Calendly account if you don't already have one.
2. Register a new OAuth2 application in your Calendly account:
   - Log in to Calendly
   - Go to "Integrations" → "API & Webhooks"
   - Click on "Create New App"
   - Set the redirect URI to your website URL (e.g., `https://yoursite.com/dashboard`)
   - Save the Client ID and Client Secret

3. Create a `.env.local` file in the project root with the following variables:
   ```
   NEXT_PUBLIC_CALENDLY_CLIENT_ID=your_client_id_here
   CALENDLY_CLIENT_SECRET=your_client_secret_here
   ```

4. Restart your development server after adding these environment variables.

> **Security Note**: The Client Secret should never be exposed to the client-side code. Our implementation uses secure API routes to handle OAuth2 token exchange. The Client ID is public and can be safely used in client-side code.

## Liste des Emails et Contenus Associés

1. **mail_0**
   - "Confirmation de votre inscription"
   - Contenu : Confirmation de la Thérapie
   - Formulaires : 
     * Inscription, 
     * Paiement
     * 1ere date agenda

2. **mail_1**
   - "Bienvenue chez Cœur à Corps – Un voyage inspirant pour votre couple"
   - Formulaires : 
     * AVC_1
     * AGENDA COMPLET
     * CONDITIONS GENERALES
     * PROFIL DU COUPLE
     * ESPACE CLIENT

3. **mail_2**
   - "Suite de notre première séance – instructions et préparation"
   - Contenu : 
     * APC_1 
     * Test de l'amoureux

4. **mail_3**
   - "Préparation à notre séance individuelle"
   - Contenu :
     * Capsule enfance
     * CAPSULE "INTERDICTIONS
     * OBLIGATIONS : COMMENT SE CONSTRUISENT NOS SCHEMAS RELATIONNELS"

5. **mail_4**
   - "Suite à votre séance individuelle"
   - Contenu : 
      * FORM_AS
      * Vidéo "l'autorisation d'aimer"

6. **mail_5**
   - "Préparation pour votre deuxième séance individuelle"
   - Contenu :
     * FORM_ENTRE2
     * Test de dépendance relationnelle
     * Capsule dépendance et rejet

7. **mail_as2**
   - "Suite à votre deuxième séance individuelle"
   - Contenu :
     * FORM_IAS - Test d'Estime de Soi
     * CAPSULE DESIR DE SOI

8. **mail_6**
   - "Préparation Séance 3 - Célébration de votre Odyssée Intérieure"
   - Contenu : 
      * FORM_AT 
      * FORMULAIRE INTROSPECTION _Entre 2

9. **mail_7**
   - "Préparation pour votre prochaine séance de couple"
   - Contenu : 
      * AVC_1_2

10. **mail_8**
    - "Suite de votre Parcours 'Parenthèse Thérapeutique' – Prochaines Étapes"
    - Contenu :
      * AUDIO PERSONNEL EN RETOUR
      * TEST EQUILIBRE AMOUREUX
      * Capsule "Le Couple Conscient"
      * Test Etat des lieux sexuel
      * Code promo sur Cycle 2 10%

## Next steps

- [Join our Slack community to ask questions and get help][sanity-community]
- [How to edit my content structure?][sanity-schema-types]
- [How to query content?][sanity-groq]
- [What is content modelling?][sanity-content-modelling]

[vercel-deploy]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsanity-io%2Ftemplate-nextjs-personal-website&project-name=nextjs-personal-website&repository-name=nextjs-personal-website&demo-title=Personal+Website+with+Built-in+Content+Editing&demo-description=A+Sanity-powered+personal+website+with+built-in+content+editing+and+instant+previews.+Uses+App+Router.&demo-url=https%3A%2F%2Ftemplate-nextjs-personal-website.sanity.build%2F&demo-image=https%3A%2F%2Fuser-images.githubusercontent.com%2F6951139%2F206395107-e58a796d-13a9-400a-94b6-31cb5df054ab.png&integration-ids=oac_hb2LITYajhRQ0i4QznmKH7gx&external-id=nextjs%3Btemplate%3Dtemplate-nextjs-personal-website
[integration]: https://www.sanity.io/docs/vercel-integration?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[`.env.local.example`]: .env.local.example
[nextjs]: https://github.com/vercel/next.js
[sanity-create]: https://www.sanity.io/get-started/create-project?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-deployment]: https://www.sanity.io/docs/deployment?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-homepage]: https://www.sanity.io?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-community]: https://slack.sanity.io/
[sanity-schema-types]: https://www.sanity.io/docs/schema-types?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-github]: https://github.com/sanity-io/sanity/discussions
[sanity-groq]: https://www.sanity.io/docs/groq?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-content-modelling]: https://www.sanity.io/docs/content-modelling?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-webhooks]: https://www.sanity.io/docs/webhooks?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[localhost-3000]: http://localhost:3000
[localhost-3000-studio]: http://localhost:3000/studio
[vercel]: https://vercel.com
[vercel-github]: https://github.com/vercel/next.js/discussions
[personal-website-pages]: https://github.com/sanity-io/template-nextjs-personal-website
[presentation]: https://www.sanity.io/docs/presentation
