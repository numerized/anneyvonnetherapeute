'use client'

import { addDays, format, isValid, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  Calendar,
  Check,
  Clock,
  LogOut,
  Mail,
  Square,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CalendlyModal } from '@/components/dashboard/CalendlyModal'
import { ResourceCheckboxes } from '@/components/dashboard/ResourceCheckboxes'
import { TimeSimulationPanel } from '@/components/dashboard/TimeSimulationPanel'
import { UserProfileSection } from '@/components/dashboard/UserProfileSection'
import { Button } from '@/components/ui/button'
import { ZenClickButton } from '@/components/ZenClickButton'
import {
  coupleTherapyJourney,
  TherapyJourneyEvent,
} from '@/lib/coupleTherapyJourney'
import { app } from '@/lib/firebase'
import { getUserOffers, Offer } from '@/lib/offerService'
import {
  createOrUpdateUser,
  getUserById,
  SessionDetails,
  UserProfile,
} from '@/lib/userService'

export default function DashboardPage() {
  const router = useRouter()

  // Authentication state
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<Offer | null>(null)

  // Session state
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(
    new Set(),
  )
  const [sessionDates, setSessionDates] = useState<Record<string, string>>({})
  const [invalidDates, setInvalidDates] = useState<Record<string, boolean>>({})
  const [selectedEvent, setSelectedEvent] =
    useState<TherapyJourneyEvent | null>(null)
  const [showCalendlyModal, setShowCalendlyModal] = useState(false)

  // UI refresh counter
  const [uiRefreshKey, setUiRefreshKey] = useState(0)

  // Add state to track which partner is booking
  const [activePartner, setActivePartner] = useState<
    'partner1' | 'partner2' | 'both'
  >('both')
  const [bookingSession, setBookingSession] = useState<string | null>(null)

  // Add state for time simulation
  const [simulationEnabled, setSimulationEnabled] = useState(false)
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null)

  // Helper function to get session date - defined after sessionDates declaration
  const getSessionDate = useCallback(
    (sessionId: string): string | undefined => {
      // Always use the exact session ID provided
      return sessionDates[sessionId]
    },
    [sessionDates],
  )

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      const auth = getAuth(app)
      await signOut(auth)
      router.push('/') // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Get user and partner profiles
  const getUserProfiles = async (userId: string) => {
    try {
      const userProfile = await getUserById(userId)
      if (!userProfile) {
        return { userProfile: null, partnerProfile: null }
      }

      return {
        userProfile,
        partnerProfile: userProfile.partnerProfile || null,
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error)
      return { userProfile: null, partnerProfile: null }
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user?.uid) return
    const { userProfile, partnerProfile } = await getUserProfiles(user.uid)
    setUserProfile(userProfile)
    setPartnerProfile(partnerProfile)
  }

  useEffect(() => {
    const auth = getAuth(app)

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)

        // Check if user is a therapist
        const db = getFirestore(app)
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()

        if (userData?.isTherapist) {
          // If therapist, redirect to team dashboard
          router.push('/team-dashboard')
          return
        }

        async function fetchUserProfile() {
          if (!user || !user.uid) return

          try {
            const { userProfile, partnerProfile } = await getUserProfiles(
              user.uid,
            )
            setUserProfile(userProfile)
            setPartnerProfile(partnerProfile)
          } catch (error) {
            console.error('Error fetching user profile:', error)
          } finally {
            setLoading(false)
          }
        }

        fetchUserProfile()
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  // Effect to load user and partner profiles
  useEffect(() => {
    if (user?.uid) {
      // Load user profiles
      getUserProfiles(user.uid).then(({ userProfile, partnerProfile }) => {
        setUserProfile(userProfile)
        setPartnerProfile(partnerProfile)

        // Load user's plan from purchases using email addresses
        if (userProfile?.email) {
          getUserOffers(userProfile.email, partnerProfile?.email)
            .then((offers) => {
              // Get the most recent offer by creation date
              const sortedOffers = offers.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
              )
              if (sortedOffers.length > 0) {
                setCurrentPlan(sortedOffers[0])
              }
            })
            .catch((error) => {
              console.error('Error fetching user offers:', error)
            })
        }
      })
    }
  }, [user?.uid])

  // Effect to update session dates
  useEffect(() => {
    if (userProfile?.sessionDates !== undefined) {
      setSessionDates(userProfile.sessionDates || {})
    }
  }, [userProfile?.sessionDates])

  // Effect to reset bookingSession when sessionDates are updated from Firestore
  useEffect(() => {
    // If we have a bookingSession and that session now has a date in sessionDates,
    // we can reset the bookingSession state
    if (bookingSession && sessionDates[bookingSession]) {
      setBookingSession(null)
    }
  }, [bookingSession, sessionDates])

  // Function to check if a date is valid (at least 4 weeks after the previous session)
  const isDateValid = useCallback(
    (sessionId: string, dateStr: string): boolean => {
      // Define session dependencies (which session must be at least 4 weeks after which)
      const sessionDependencyMap: Record<string, string | string[]> = {
        individual1_partner1: 'initial',
        individual2_partner1: 'individual1_partner1',
        individual3_partner1: 'individual2_partner1',
        individual1_partner2: 'initial',
        individual2_partner2: 'individual1_partner2',
        individual3_partner2: 'individual2_partner2',
        final: ['individual3_partner1', 'individual3_partner2'],
      }

      try {
        // Check if the session has a dependency
        const dependentSessionId = sessionDependencyMap[sessionId]
        if (!dependentSessionId) return true // No dependency, date is valid

        // If dependentSessionId is an array, check each dependency
        if (Array.isArray(dependentSessionId)) {
          // Make sure all dependent sessions have dates
          const missingDates = dependentSessionId.filter(
            (depId) => !getSessionDate(depId),
          )
          if (missingDates.length > 0) {
            return false
          }

          // Find the most recent dependent session date
          let latestDate: Date | null = null

          for (const depId of dependentSessionId) {
            const depDate = getSessionDate(depId)
            if (depDate) {
              const date = new Date(depDate)
              if (!latestDate || date > latestDate) {
                latestDate = date
              }
            }
          }

          if (!latestDate) return true // No dependent session dates, date is valid

          const proposedDate = new Date(dateStr)

          // Calculate the minimum allowed date (latestDate + 4 weeks)
          const minimumDate = new Date(latestDate)
          minimumDate.setDate(minimumDate.getDate() + 28) // 4 weeks minimum gap

          // Check if the proposed date is at least 4 weeks after the latest dependent session
          if (proposedDate < minimumDate) {
            return false
          }

          return true
        }

        // Single dependency case
        const dependentSessionDate = getSessionDate(dependentSessionId)
        if (!dependentSessionDate) return true // No dependent session date, date is valid

        const proposedDate = new Date(dateStr)
        const dependentDate = new Date(dependentSessionDate)

        // Calculate the minimum allowed date (dependentDate + 4 weeks)
        const minimumDate = new Date(dependentDate)
        minimumDate.setDate(minimumDate.getDate() + 28) // 4 weeks minimum gap

        // Check if the proposed date is at least 4 weeks after the dependent session
        if (proposedDate < minimumDate) {
          return false
        }

        return true
      } catch (error) {
        console.error(`Error validating date for session ${sessionId}:`, error)
        return false
      }
    },
    [getSessionDate],
  )

  // Validate all existing dates when session dates change
  useEffect(() => {
    const newInvalidDates: Record<string, boolean> = {}

    // Check each session date
    Object.entries(sessionDates).forEach(([sessionId, dateStr]) => {
      newInvalidDates[sessionId] = !isDateValid(sessionId, dateStr)
    })

    // Update invalid dates state
    setInvalidDates(newInvalidDates)
  }, [sessionDates, isDateValid])

  // Therapy Journey Logic
  const isSessionAvailable = (event: TherapyJourneyEvent): boolean => {
    if (event.type !== 'session') return false

    // First make sure all the dependencies are completed or at least scheduled
    // AND that they don't have invalid dates
    if (event.id === 'initial') return true

    if (!event.dependsOn) return true

    if (Array.isArray(event.dependsOn)) {
      return event.dependsOn.every(
        (dep) =>
          (isSessionCompleted(dep) || !!getSessionDate(dep)) &&
          !invalidDates[dep],
      )
    }

    return (
      (isSessionCompleted(event.dependsOn) ||
        !!getSessionDate(event.dependsOn)) &&
      !invalidDates[event.dependsOn]
    )
  }

  const getSessionDateConstraints = (event: TherapyJourneyEvent) => {
    const minDate = new Date()

    // For the first individual session for either partner, set minimum date to 4 weeks after initial session
    if (
      event.id === 'individual1_partner1' ||
      event.id === 'individual1_partner2'
    ) {
      const initialDate = getSessionDate('initial')
      if (initialDate) {
        const initialSessionDate = new Date(initialDate)
        minDate.setTime(initialSessionDate.getTime())
        minDate.setDate(minDate.getDate() + 28) // 4 weeks minimum gap
      }
    } else if (event.dependsOn && event.daysOffset) {
      const dependentId = Array.isArray(event.dependsOn)
        ? event.dependsOn[0]
        : event.dependsOn

      const dependentDate = getSessionDate(dependentId)
      if (dependentDate) {
        const depDate = new Date(dependentDate)
        minDate.setTime(depDate.getTime())
        minDate.setDate(minDate.getDate() + event.daysOffset)
      }
    }

    const maxDate = new Date(minDate)
    maxDate.setDate(maxDate.getDate() + 30) // Allow booking up to 30 days after min date

    return { minDate, maxDate }
  }

  const hasPreviousInvalidDates = (sessionId: string): boolean => {
    // Define session dependencies based on the therapy journey
    const sessionDependencyMap: Record<string, string | string[]> = {
      individual1_partner1: 'initial',
      individual2_partner1: 'individual1_partner1',
      individual3_partner1: 'individual2_partner1',
      individual1_partner2: 'initial',
      individual2_partner2: 'individual1_partner2',
      individual3_partner2: 'individual2_partner2',
      final: ['individual3_partner1', 'individual3_partner2'],
    }

    // Check if any direct dependencies have invalid dates
    const directDependencies = sessionDependencyMap[sessionId]
    if (!directDependencies) return false

    // Check each dependency (array or single value)
    if (Array.isArray(directDependencies)) {
      return directDependencies.some(
        (depId) => invalidDates[depId] || hasPreviousInvalidDates(depId),
      )
    }

    // Single dependency case
    return (
      invalidDates[directDependencies] ||
      hasPreviousInvalidDates(directDependencies)
    )
  }

  const getSessionUnavailableReason = (event: TherapyJourneyEvent): string => {
    // Check if there are invalid dates in previous sessions
    if (event.id !== 'initial' && hasPreviousInvalidDates(event.id)) {
      return "Impossible de réserver cette séance car une ou plusieurs séances précédentes ne respectent pas l'écart de 4 semaines requis."
    }

    // Check if dependencies are completed
    if (event.dependsOn) {
      // Handle array of dependencies
      if (Array.isArray(event.dependsOn)) {
        const missingDeps = event.dependsOn.filter(
          (dep) => !isSessionCompleted(dep) && !getSessionDate(dep),
        )
        if (missingDeps.length > 0) {
          return "Veuillez d'abord compléter les étapes précédentes."
        }

        // Check if any dependency has an invalid date
        const invalidDeps = event.dependsOn.filter((dep) => invalidDates[dep])
        if (invalidDeps.length > 0) {
          return "Une ou plusieurs séances précédentes ne respectent pas l'écart de 4 semaines requis."
        }
      }
      // Handle single dependency
      else {
        if (
          !isSessionCompleted(event.dependsOn) &&
          !getSessionDate(event.dependsOn)
        ) {
          return "Veuillez d'abord compléter les étapes précédentes."
        }

        if (invalidDates[event.dependsOn]) {
          return "La séance précédente ne respecte pas l'écart de 4 semaines requis."
        }
      }
    }

    return ''
  }

  const handleSessionClick = (event: TherapyJourneyEvent) => {
    // If this is a session that already has a date, don't allow rebooking
    if (getSessionDate(event.id)) {
      console.error(
        "Cette séance est déjà programmée. Utilisez le bouton d'annulation si vous souhaitez la reprogrammer.",
      )
      return
    }

    // Normal availability check for new bookings
    if (!isSessionAvailable(event)) {
      const reason = getSessionUnavailableReason(event)
      console.error(
        reason || "Veuillez d'abord compléter les étapes précédentes",
      )
      return
    }

    if (event.type !== 'session' || !event.sessionType) {
      console.error("Ce type d'événement ne peut pas être programmé")
      return
    }

    // Store the session ID in localStorage to ensure we only update this specific session
    localStorage.setItem('currentBookingSessionId', event.id)
    console.log(
      `Starting booking for session: ${event.id} - saved to localStorage`,
    )

    // Set the booking session to show loading state
    setBookingSession(event.id)
    setSelectedEvent(event)
    // Store which partner this session is for to determine which email to use
    setActivePartner(event.partner || 'both')
    setShowCalendlyModal(true)
  }

  const handleAppointmentScheduled = async (eventData: any) => {
    try {
      if (!user) {
        console.error('No user found')
        return
      }

      // Get the current booking session ID from localStorage
      const currentBookingSessionId = localStorage.getItem(
        'currentBookingSessionId',
      )

      if (!currentBookingSessionId) {
        console.error('No session ID found in localStorage')
        return
      }

      console.log(
        `Processing appointment for session ID from localStorage: ${currentBookingSessionId}`,
      )

      // Find the session from the journey based on the ID from localStorage
      const sessionToUse = coupleTherapyJourney.find(
        (event) => event.id === currentBookingSessionId,
      )

      if (!sessionToUse) {
        console.error(`Session not found with ID: ${currentBookingSessionId}`)
        return
      }

      // Validate that we have the expected event data structure
      if (
        eventData.event !== 'calendly.event_scheduled' ||
        !eventData.payload
      ) {
        console.error('Invalid event data format:', eventData)
        console.error('Format de données invalide. Veuillez réessayer.')
        setBookingSession(null) // Reset booking session state on error
        return
      }

      // Extract data from Calendly's standard event structure
      const eventUri = eventData.payload?.event?.uri || ''
      const inviteeUri = eventData.payload?.invitee?.uri || ''

      if (!eventUri) {
        console.error('Missing event URI:', eventData)
        console.error(
          'Impossible de trouver les détails du rendez-vous. Veuillez réessayer.',
        )
        setBookingSession(null) // Reset booking session state on error
        return
      }

      // Extract event ID from the URI
      const eventId = eventUri.split('/').pop() || ''

      try {
        // Fetch event details from our API
        const eventDetailsResponse = await fetch(
          `/api/calendly/event-details?eventUri=${encodeURIComponent(eventUri)}`,
        )

        if (!eventDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch event details: ${eventDetailsResponse.status}`,
          )
        }

        const eventDetailsResult = await eventDetailsResponse.json()

        if (!eventDetailsResult.success || !eventDetailsResult.data) {
          throw new Error('Invalid response from event details API')
        }

        const eventDetails = eventDetailsResult.data

        // Get event start time and end time
        let startTime = eventDetails.start_time
        let endTime = eventDetails.end_time

        if (!startTime) {
          // Fallback (should rarely happen)
          const scheduledTime = new Date()
          scheduledTime.setHours(scheduledTime.getHours() + 1)
          startTime = scheduledTime.toISOString()

          const scheduledEndTime = new Date(scheduledTime)
          scheduledEndTime.setHours(scheduledEndTime.getHours() + 1)
          endTime = scheduledEndTime.toISOString()
        }

        // Dismiss loading
        console.log('Rendez-vous programmé')

        // Format date for display
        const dateObj = new Date(startTime)
        const formattedDate = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(dateObj)

        // Format to capitalize first letter of the day name
        const formattedDateCapitalized =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

        // Get Firestore reference
        const db = getFirestore(app)
        const userDocRef = doc(db, 'users', user.uid)

        try {
          // Get current data first
          const userDocSnap = await getDoc(userDocRef)

          if (!userDocSnap.exists()) {
            throw new Error('User document does not exist!')
          }

          // Get current data
          const userData = userDocSnap.data()

          // Create the new session detail
          const newSessionDetail: SessionDetails = {
            date: formattedDate,
            eventUri: eventUri,
            formattedDate: formattedDateCapitalized,
            startTime: startTime,
            endTime: endTime,
            lastUpdated: Timestamp.now(),
            sessionType: sessionToUse.id, // Always use the event id as sessionType
            status: 'scheduled', // Default status for new appointments
            calendlyData: {
              eventUri: eventUri,
              inviteeUri: inviteeUri,
            },
          }

          // Add additional fields if available in the payload
          if (eventData.payload?.event) {
            // Add location if available
            if (eventData.payload.event.location) {
              newSessionDetail.location = eventData.payload.event.location
            }

            // Add cancel URL if available
            const cancelUrl =
              eventData.payload.invitee?.cancel_url ||
              eventData.payload.event?.cancel_url

            if (cancelUrl) {
              newSessionDetail.cancelUrl = cancelUrl
            }

            // Add reschedule URL if available
            const rescheduleUrl =
              eventData.payload.invitee?.reschedule_url ||
              eventData.payload.event?.reschedule_url

            if (rescheduleUrl) {
              newSessionDetail.rescheduleUrl = rescheduleUrl
            }
          }

          // Just update the specific session data by session ID from localStorage
          // This ensures we're only updating the exact session that was clicked
          const updateObject = {
            [`sessionDetails.${currentBookingSessionId}`]: newSessionDetail,
            [`sessionDates.${currentBookingSessionId}`]: startTime,
            updatedAt: Timestamp.now(),
          }

          console.log(
            `Updating session from localStorage: ${currentBookingSessionId}`,
          )

          // Update the document with direct update
          await updateDoc(userDocRef, updateObject)

          // Verify data after update
          const verifyDocSnap = await getDoc(userDocRef)
          const verifyData = verifyDocSnap.data()

          // Alert the user with a unique ID to prevent duplicates
          console.log(
            `Votre séance est programmée pour le ${formattedDateCapitalized}`,
          )

          // Update session dates in state to reflect the new date
          setSessionDates((prev) => {
            const newDates = { ...prev }
            newDates[currentBookingSessionId] = startTime
            return newDates
          })

          // Reset selected session
          setSelectedEvent(null)

          // Reset booking session to remove the loading state
          setBookingSession(null)

          // Hide the Calendly modal
          setShowCalendlyModal(false)

          // Clear localStorage after successful booking
          localStorage.removeItem('currentBookingSessionId')

          // Force UI refresh
          setUiRefreshKey((prev) => prev + 1)
        } catch (error) {
          console.error('Error updating document:', error)
          console.error(
            "Une erreur est survenue lors de l'enregistrement du rendez-vous.",
          )
          setBookingSession(null) // Reset booking session state on error
          return
        }
      } catch (error) {
        console.error('Error handling appointment scheduling:', error)
        console.error(
          "Une erreur s'est produite lors de la programmation. Veuillez réessayer.",
        )
        setShowCalendlyModal(false)
        setBookingSession(null) // Reset booking session state on error
      }
    } catch (error) {
      console.error('Error handling appointment scheduling:', error)
      console.error(
        "Une erreur s'est produite lors de la programmation. Veuillez réessayer.",
      )
      setShowCalendlyModal(false)
      setBookingSession(null) // Reset booking session state on error
    }
  }

  // Check if a session should be marked as completed based on its date
  const isSessionCompleted = (sessionId: string): boolean => {
    // If it's in completedSessions from database/state, it's completed
    if (completedSessions.has(sessionId)) {
      return true
    }

    // If the session has a scheduled date, check if that time + 1 hour has passed
    const sessionDate = getSessionDate(sessionId)
    if (sessionDate) {
      try {
        const sessionDateTime = new Date(sessionDate)

        // Add 1 hour to the session date
        const sessionEndTime = new Date(sessionDateTime)
        sessionEndTime.setHours(sessionEndTime.getHours() + 1)

        // Compare with current time
        const currentTime = getCurrentDate()

        // If the session end time has passed, mark as completed
        if (sessionEndTime <= currentTime) {
          // Don't update state here to avoid re-renders during render
          return true
        }
      } catch (error) {
        console.error('Error checking session completion status:', error)
      }
    }

    return false
  }

  // Function to handle simulated date changes
  const handleSimulatedDateChange = (newDate: Date) => {
    setSimulatedDate(newDate)
    console.log('Simulated date changed to:', format(newDate, 'yyyy-MM-dd'))
  }

  // Function to toggle simulation mode
  const toggleSimulationMode = () => {
    // When enabling, set the simulated date to today as a starting point
    if (!simulationEnabled) {
      setSimulatedDate(new Date())
    } else {
      setSimulatedDate(null)
    }
    setSimulationEnabled(!simulationEnabled)
  }

  // Helper function to get the current date, respecting simulation if enabled
  const getCurrentDate = useCallback((): Date => {
    return simulationEnabled && simulatedDate ? simulatedDate : new Date()
  }, [simulationEnabled, simulatedDate])

  // Function to check if a date is in the past (or simulated past)
  const isDateInPast = useCallback(
    (dateStr: string): boolean => {
      const today = getCurrentDate()
      const date = new Date(dateStr)
      return date < today
    },
    [getCurrentDate],
  )

  // Function to format a date based on its relative position to today (or simulated today)
  const getFormattedDate = useCallback(
    (dateStr: string): string => {
      try {
        const date = parseISO(dateStr)
        if (!isValid(date)) return 'Date invalide'

        const today = getCurrentDate()

        return format(date, 'dd MMMM yyyy', { locale: fr })
      } catch (error) {
        console.error('Error formatting date:', error, dateStr)
        return 'Date invalide'
      }
    },
    [getCurrentDate],
  )

  // Function to mark a session as completed
  const handleCompleteSession = async (sessionId: string) => {
    if (!user) return

    try {
      // Update local state first for immediate UI feedback
      const newCompletedSessions = new Set(completedSessions)
      newCompletedSessions.add(sessionId)
      setCompletedSessions(newCompletedSessions)

      // Update in Firestore
      const db = getFirestore(app)
      const userRef = doc(db, 'users', user.uid)

      await updateDoc(userRef, {
        completedSessions: Array.from(newCompletedSessions),
      })

      console.log(`Session ${sessionId} marked as completed`)

      // Force UI refresh
      setUiRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error('Error marking session as completed:', error)
    }
  }

  // Update function to handle setting a session date
  const handleSetSessionDate = async (sessionId: string, dateStr: string) => {
    if (!user) return

    try {
      // Validate the date first (must be at least 4 weeks after any dependent sessions)
      if (!isDateValid(sessionId, dateStr)) {
        toast.error(
          'La date doit être au moins 4 semaines après la séance précédente.',
        )
        return
      }

      // Update local state first for immediate UI feedback
      const newDates = { ...sessionDates, [sessionId]: dateStr }
      setSessionDates(newDates)

      // Update in Firestore
      const db = getFirestore(app)
      const userRef = doc(db, 'users', user.uid)

      await updateDoc(userRef, {
        [`sessionDates.${sessionId}`]: dateStr,
      })

      console.log(`Session ${sessionId} date set to ${dateStr}`)

      // Special case: If this is today's date or in the past (simulated or real), mark as completed
      const today = getCurrentDate()
      const sessionDate = new Date(dateStr)

      if (sessionDate <= today) {
        await handleCompleteSession(sessionId)
      }

      toast.success('Date de séance enregistrée')

      // Force UI refresh
      setUiRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error('Error setting session date:', error)
      toast.error("Erreur lors de l'enregistrement de la date.")
    }
  }

  // Render journey timeline by phase
  const renderJourneyPhase = (
    phase: 'initial' | 'individual' | 'final',
    partner?: 'partner1' | 'partner2',
  ) => {
    const events = coupleTherapyJourney.filter(
      (e) => e.phase === phase && (!partner || e.partner === partner),
    )

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const isComplete = isSessionCompleted(event.id)
          const isAvailable = isSessionAvailable(event)

          // Format date if exists
          let dateStr = ''
          if (getSessionDate(event.id)) {
            try {
              const sessionDateStr = getSessionDate(event.id) || ''
              const sessionDate = new Date(sessionDateStr)
              if (!isNaN(sessionDate.getTime())) {
                // Capitalize first letter of the day name
                dateStr = format(sessionDate, 'EEEE d MMMM yyyy à HH:mm', {
                  locale: fr,
                })
                dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
              } else {
                console.error(
                  `Invalid date for event ${event.id}:`,
                  getSessionDate(event.id),
                )
                dateStr = 'Date invalide'
              }
            } catch (error) {
              console.error(
                `Error formatting date for event ${event.id}:`,
                error,
              )
              dateStr = 'Erreur de date'
            }
          }

          // Return null for non-session events, but first check if they have resources
          // If they have resources, we'll render those separately
          if (event.type !== 'session') {
            if (event.resources && event.resources.length > 0) {
              return (
                <div key={event.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary-cream/70">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-primary-cream/70">
                      <div className="font-medium">
                        {event.title}

                        {/* Show email timing information in localhost development mode */}
                        {process.env.NODE_ENV === 'development' && (
                          <span className="ml-2 text-xs font-normal text-orange-400">
                            {event.triggerType === 'immediate' &&
                              '(envoi immédiat)'}
                            {event.triggerType === 'before' &&
                              event.triggerDays &&
                              `(${event.triggerDays} jour${event.triggerDays > 1 ? 's' : ''} avant)`}
                            {event.triggerType === 'after' &&
                              event.triggerDays &&
                              `(${event.triggerDays} jour${event.triggerDays > 1 ? 's' : ''} après)`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ResourceCheckboxes resources={event.resources} />
                </div>
              )
            }
            return null
          }

          // Determine if this event should have a booking button (all events except partner2 sessions)
          const showBookingButton =
            phase === 'initial' || phase === 'final' || phase === 'individual'

          return (
            <div key={event.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete
                      ? 'text-emerald-500'
                      : isAvailable
                        ? 'text-primary-cream'
                        : 'text-primary-cream/30'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={
                    isAvailable
                      ? 'text-[rgb(247_237_226_)]'
                      : 'text-[rgb(247_237_226_)]/30'
                  }
                >
                  <div className="font-medium">
                    {event.title}
                    {!isComplete &&
                      isAvailable &&
                      !getSessionDate(event.id) && (
                        <span className="block text-xs text-[rgb(247_237_226_)] mt-1">
                          Prendre rendez-vous {event.title.split(' - ')[0]}
                        </span>
                      )}
                  </div>

                  {/* Render the date with appropriate styling */}
                  {getSessionDate(event.id) && (
                    <div
                      className={`text-sm mt-1 flex items-center gap-1.5 px-2 py-1 rounded-md w-fit
                        ${
                          invalidDates[event.id]
                            ? 'text-red-400 font-medium bg-red-900/30'
                            : 'text-green-400 font-medium bg-green-900/30'
                        }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{dateStr}</span>
                      {invalidDates[event.id] && (
                        <span className="text-xs ml-1">
                          (moins de 4 semaines)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {showBookingButton &&
                !isComplete &&
                // Show date under "Séance de Couple Initiale" when booked
                (event.id === 'initial' && getSessionDate(event.id) ? (
                  <div className="ml-8">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                        invalidDates[event.id]
                          ? 'bg-yellow-500/20 text-yellow-200'
                          : 'bg-blue-500/20 text-blue-200'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(
                          getSessionDate(event.id) as string,
                        ).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ) : (
                  // For "Séance Individuelle 1" or other sessions show the booking button
                  !getSessionDate(event.id) &&
                  isAvailable && (
                    <div className="ml-8">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 border-[rgb(247_237_226_)]/30 text-[rgb(247_237_226_)] hover:bg-[rgb(247_237_226_)]/10 hover:text-[rgb(247_237_226_)]"
                        onClick={() => handleSessionClick(event)}
                        disabled={bookingSession === event.id}
                      >
                        {bookingSession === event.id ? (
                          <>
                            <span className="w-3 h-3 mr-2 rounded-full border-2 border-t-transparent border-[rgb(247_237_226_)] animate-spin" />
                            Chargement...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3 mr-2" />
                            Réserver cette séance
                          </>
                        )}
                      </Button>
                    </div>
                  )
                ))}
              {event.resources && event.resources.length > 0 && (
                <ResourceCheckboxes resources={event.resources} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Render user profile section
  const renderUserProfileSection = () => (
    <UserProfileSection
      user={user}
      partner={null}
      userProfile={userProfile}
      partnerProfile={partnerProfile}
      onProfileUpdate={handleProfileUpdate}
    />
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-6 h-6 animate-spin text-primary-cream/80" />
        </div>
      </div>
    )
  }

  return (
    <div
      key={uiRefreshKey}
      className="min-h-screen bg-primary-forest text-primary-cream"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-coral text-center">
            Tableau de bord
          </h1>
          <div className="flex gap-4">
            <ZenClickButton />
            <Button
              variant="outline"
              className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {renderUserProfileSection()}

        {/* Calendly Modal */}
        {selectedEvent && (
          <CalendlyModal
            isOpen={showCalendlyModal}
            onClose={(isScheduled) => {
              setShowCalendlyModal(false)
              setSelectedEvent(null)
              setActivePartner('both')

              // Only reset bookingSession if the modal is closed without scheduling
              if (!isScheduled) {
                setBookingSession(null)
              }
            }}
            sessionType={selectedEvent.sessionType || 'initial'}
            onAppointmentScheduled={handleAppointmentScheduled}
            userEmail={
              activePartner === 'partner2'
                ? partnerProfile?.email
                : userProfile?.email
            }
            guestEmail={
              selectedEvent.phase === 'initial' ||
              selectedEvent.phase === 'final'
                ? activePartner === 'partner2'
                  ? userProfile?.email
                  : partnerProfile?.email
                : undefined
            }
            minDate={
              selectedEvent
                ? getSessionDateConstraints(selectedEvent).minDate
                : undefined
            }
          />
        )}

        {/* Therapy Journey Section */}
        <div className="bg-[rgb(247_237_226_/0.1)] rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-1 text-primary-coral">
            Votre parcours thérapeutique
          </h2>
          <p className="text-[rgb(247_237_226_)]/70 mb-6">
            Tous les rendez-vous, ici, les liens vers les appels vidéo
            s'afficheront ici 30min avant le rendez-vous.
          </p>

          {/* Display current plan */}
          {currentPlan && (
            <div className="mb-6 p-4 bg-[rgb(247_237_226_/0.05)] rounded-lg">
              <h3 className="text-lg font-medium text-primary-coral mb-2">
                Votre formule actuelle
              </h3>
              <div className="text-[rgb(247_237_226_)]/90">
                <p className="font-medium">{currentPlan.metadata.title}</p>
                <p className="text-sm text-[rgb(247_237_226_)]/70 mt-1">
                  {currentPlan.metadata.description || currentPlan.description}
                </p>
              </div>
            </div>
          )}

          {/* Display therapy journey phases */}
          <div className="mt-8 space-y-8">
            {/* Initial Phase */}
            <div>
              <h3 className="text-xl font-semibold text-primary-coral mb-4">
                Phase Initiale
              </h3>
              {renderJourneyPhase('initial')}
            </div>

            {/* Individual Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Partner 1 Journey */}
              <div>
                <h3 className="text-xl font-semibold text-primary-coral mb-4">
                  Parcours Individuel de{' '}
                  {userProfile?.firstName
                    ? `${userProfile.firstName}`
                    : '- Partenaire 1'}
                </h3>
                {renderJourneyPhase('individual', 'partner1')}
              </div>

              {/* Partner 2 Journey */}
              <div>
                <h3 className="text-xl font-semibold text-primary-coral mb-4">
                  Parcours Individuel de
                  {
                    ' '
                    /* eslint-disable-next-line no-nested-ternary */
                  }
                  {partnerProfile?.firstName
                    ? `${partnerProfile.firstName}`
                    : userProfile?.firstName
                      ? '- Partenaire 2'
                      : '- Partenaire 2'}
                </h3>
                {renderJourneyPhase('individual', 'partner2')}
              </div>
            </div>

            {/* Final Phase */}
            <div>
              <h3 className="text-xl font-semibold text-primary-coral mb-4">
                Phase Finale
              </h3>
              {renderJourneyPhase('final')}
            </div>
          </div>
        </div>

        {/* Add time simulation panel */}
        <TimeSimulationPanel
          onDateChange={handleSimulatedDateChange}
          isEnabled={simulationEnabled}
        />

        {/* Add simulation control button - developers only  */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs px-2 py-1 h-6 ${simulationEnabled ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={toggleSimulationMode}
            >
              {simulationEnabled
                ? 'Désactiver Simulation'
                : 'Activer Simulation'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
