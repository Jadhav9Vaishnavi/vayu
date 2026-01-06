import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [bands, setBands] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFamilyData()
    } else {
      setMembers([])
      setBands([])
      setSubscriptions([])
      setIsLoading(false)
    }
  }, [user])

  const loadFamilyData = () => {
    setIsLoading(true)
    const storedMembers = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
    const storedBands = JSON.parse(localStorage.getItem(`vayu_bands_${user.id}`) || '[]')
    const storedSubs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')

    setMembers(storedMembers)
    setBands(storedBands)
    setSubscriptions(storedSubs)
    setIsLoading(false)
  }

  const addMember = (memberData) => {
    const newMember = {
      id: `member_${Date.now()}`,
      ...memberData,
      privacySettings: {
        fullName: true,
        age: true,
        bloodGroup: true,
        allergies: false,
        medicalCondition: false,
        homeAddress: false,
        emergencyContacts: true,
        relationship: true
      },
      bandId: null,
      createdAt: new Date().toISOString()
    }

    const updatedMembers = [...members, newMember]
    setMembers(updatedMembers)
    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))

    return newMember
  }

  const updateMember = (memberId, updates) => {
    const updatedMembers = members.map(m =>
      m.id === memberId ? { ...m, ...updates } : m
    )
    setMembers(updatedMembers)
    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))
  }

  const deleteMember = (memberId) => {
    const updatedMembers = members.filter(m => m.id !== memberId)
    setMembers(updatedMembers)
    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))

    // Also unlink any associated band
    const updatedBands = bands.map(b =>
      b.memberId === memberId ? { ...b, memberId: null } : b
    )
    setBands(updatedBands)
    localStorage.setItem(`vayu_bands_${user.id}`, JSON.stringify(updatedBands))
  }

  const updatePrivacySettings = (memberId, settings) => {
    const updatedMembers = members.map(m =>
      m.id === memberId ? { ...m, privacySettings: { ...m.privacySettings, ...settings } } : m
    )
    setMembers(updatedMembers)
    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))
  }

  const registerBand = (bandSerial, bandUniqueId) => {
    // Validate BS-BUI combination from "master database"
    const masterBands = JSON.parse(localStorage.getItem('vayu_master_bands') || '[]')
    const validBand = masterBands.find(b => b.bs === bandSerial && b.bui === bandUniqueId)

    if (!validBand) {
      return { success: false, error: 'Invalid band serial number or unique identifier' }
    }

    // Check if band is already registered
    const allUserBands = JSON.parse(localStorage.getItem('vayu_all_registered_bands') || '[]')
    if (allUserBands.find(b => b.bs === bandSerial)) {
      return { success: false, error: 'This band is already registered' }
    }

    const newBand = {
      id: `band_${Date.now()}`,
      bs: bandSerial, // Band Serial
      bui: bandUniqueId, // Band Unique Identifier
      memberId: null,
      registeredAt: new Date().toISOString()
    }

    const updatedBands = [...bands, newBand]
    setBands(updatedBands)
    localStorage.setItem(`vayu_bands_${user.id}`, JSON.stringify(updatedBands))

    // Add to global registered bands
    allUserBands.push({ ...newBand, userId: user.id })
    localStorage.setItem('vayu_all_registered_bands', JSON.stringify(allUserBands))

    return { success: true, band: newBand }
  }

  const linkBandToMember = (bandId, memberId) => {
    // Unlink band from any other member
    const updatedBands = bands.map(b => {
      if (b.id === bandId) {
        return { ...b, memberId }
      }
      if (b.memberId === memberId) {
        return { ...b, memberId: null }
      }
      return b
    })

    setBands(updatedBands)
    localStorage.setItem(`vayu_bands_${user.id}`, JSON.stringify(updatedBands))

    // Update member's bandId
    const updatedMembers = members.map(m =>
      m.id === memberId ? { ...m, bandId } : m
    )
    setMembers(updatedMembers)
    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))
  }

  const unlinkBandFromMember = (bandId) => {
    const band = bands.find(b => b.id === bandId)
    if (!band) return

    const updatedBands = bands.map(b =>
      b.id === bandId ? { ...b, memberId: null } : b
    )
    setBands(updatedBands)
    localStorage.setItem(`vayu_bands_${user.id}`, JSON.stringify(updatedBands))

    // Update member's bandId
    if (band.memberId) {
      const updatedMembers = members.map(m =>
        m.id === band.memberId ? { ...m, bandId: null } : m
      )
      setMembers(updatedMembers)
      localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(updatedMembers))
    }
  }

  const purchaseSubscription = (plan) => {
    const newSubscription = {
      id: `sub_${Date.now()}`,
      plan: plan.id,
      planName: plan.name,
      memberCount: plan.memberCount,
      price: plan.price,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      status: 'active'
    }

    const updatedSubs = [...subscriptions, newSubscription]
    setSubscriptions(updatedSubs)
    localStorage.setItem(`vayu_subscriptions_${user.id}`, JSON.stringify(updatedSubs))

    return newSubscription
  }

  const getActiveMemberSlots = () => {
    const activeSubs = subscriptions.filter(s => s.status === 'active')
    const totalSlots = activeSubs.reduce((sum, s) => sum + s.memberCount, 0)
    const usedSlots = members.filter(m => m.bandId).length
    return { total: totalSlots, used: usedSlots, available: totalSlots - usedSlots }
  }

  const getMemberByBandBUI = (bui) => {
    const band = bands.find(b => b.bui === bui)
    if (!band || !band.memberId) return null
    return members.find(m => m.id === band.memberId)
  }

  return (
    <FamilyContext.Provider value={{
      members,
      bands,
      subscriptions,
      isLoading,
      addMember,
      updateMember,
      deleteMember,
      updatePrivacySettings,
      registerBand,
      linkBandToMember,
      unlinkBandFromMember,
      purchaseSubscription,
      getActiveMemberSlots,
      getMemberByBandBUI
    }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
}

// Helper function to get public profile by BUI (used by public profile page)
export function getPublicProfileByBUI(bui) {
  const allBands = JSON.parse(localStorage.getItem('vayu_all_registered_bands') || '[]')
  const band = allBands.find(b => b.bui === bui)

  if (!band) return null

  const userMembers = JSON.parse(localStorage.getItem(`vayu_members_${band.userId}`) || '[]')
  const member = userMembers.find(m => m.id === band.memberId)

  if (!member) return null

  // Return only public fields based on privacy settings
  const publicProfile = {}
  const fields = ['fullName', 'age', 'bloodGroup', 'allergies', 'medicalCondition', 'homeAddress', 'emergencyContacts', 'relationship']

  fields.forEach(field => {
    if (member.privacySettings[field]) {
      publicProfile[field] = member[field]
    }
  })

  return publicProfile
}
