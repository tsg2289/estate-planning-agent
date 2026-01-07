import CryptoJS from 'crypto-js'
import { nanoid } from 'nanoid'

interface AnonymizationMap {
  [key: string]: string
}

export class DataAnonymizer {
  private static instance: DataAnonymizer
  private anonymizationKey: string

  private constructor() {
    this.anonymizationKey = process.env.ANONYMIZATION_SECRET || 'default-key-change-in-production'
  }

  static getInstance(): DataAnonymizer {
    if (!DataAnonymizer.instance) {
      DataAnonymizer.instance = new DataAnonymizer()
    }
    return DataAnonymizer.instance
  }

  anonymizeData(data: any): { anonymizedData: any; anonymizationMap: AnonymizationMap } {
    const anonymizationMap: AnonymizationMap = {}
    
    const anonymize = (obj: any): any => {
      if (typeof obj === 'string') {
        return this.anonymizeString(obj, anonymizationMap)
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => anonymize(item))
      }
      
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          // Anonymize sensitive field names
          const anonymizedKey = this.shouldAnonymizeKey(key) 
            ? this.createAnonymousId(key, anonymizationMap)
            : key
          result[anonymizedKey] = anonymize(value)
        }
        return result
      }
      
      return obj
    }

    const anonymizedData = anonymize(data)
    
    // Encrypt the anonymization map
    const encryptedMap = this.encryptAnonymizationMap(anonymizationMap)
    
    return { anonymizedData, anonymizationMap: encryptedMap }
  }

  deanonymizeData(anonymizedData: any, encryptedMap: AnonymizationMap): any {
    const anonymizationMap = this.decryptAnonymizationMap(encryptedMap)
    const reverseMap: AnonymizationMap = {}
    
    // Create reverse mapping
    for (const [original, anonymous] of Object.entries(anonymizationMap)) {
      reverseMap[anonymous] = original
    }

    const deanonymize = (obj: any): any => {
      if (typeof obj === 'string') {
        return reverseMap[obj] || obj
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => deanonymize(item))
      }
      
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          const originalKey = reverseMap[key] || key
          result[originalKey] = deanonymize(value)
        }
        return result
      }
      
      return obj
    }

    return deanonymize(anonymizedData)
  }

  private anonymizeString(str: string, map: AnonymizationMap): string {
    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    str = str.replace(emailRegex, (match) => this.createAnonymousId(match, map))

    // Phone number patterns
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    str = str.replace(phoneRegex, (match) => this.createAnonymousId(match, map))

    // SSN pattern
    const ssnRegex = /\b\d{3}-?\d{2}-?\d{4}\b/g
    str = str.replace(ssnRegex, (match) => this.createAnonymousId(match, map))

    // Names (common first names) - expanded list
    const namePatterns = [
      /\b(John|Jane|Michael|Sarah|David|Lisa|Robert|Mary|James|Patricia|William|Jennifer|Richard|Elizabeth|Joseph|Maria|Thomas|Susan|Christopher|Jessica|Daniel|Karen|Paul|Nancy|Mark|Betty|Donald|Helen|George|Sandra|Kenneth|Donna|Steven|Carol|Edward|Ruth|Brian|Sharon|Ronald|Michelle|Anthony|Laura|Kevin|Sarah|Jason|Kimberly|Matthew|Deborah|Gary|Dorothy|Timothy|Lisa|Jose|Nancy|Larry|Karen|Jeffrey|Betty|Frank|Helen|Scott|Sandra|Eric|Donna|Stephen|Carol|Andrew|Ruth|Raymond|Sharon|Gregory|Michelle|Joshua|Laura|Jerry|Sarah|Dennis|Kimberly|Walter|Deborah|Patrick|Dorothy|Peter|Lisa|Harold|Nancy|Douglas|Karen|Henry|Betty|Carl|Helen|Arthur|Sandra|Ryan|Donna|Roger|Carol)\b/gi
    ]
    
    namePatterns.forEach(pattern => {
      str = str.replace(pattern, (match) => this.createAnonymousId(match, map))
    })

    // Addresses (basic pattern)
    const addressRegex = /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct|Place|Pl|Circle|Cir|Parkway|Pkwy)\b/gi
    str = str.replace(addressRegex, (match) => this.createAnonymousId(match, map))

    // Dates of birth (MM/DD/YYYY, MM-DD-YYYY, etc.)
    const dobRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}\b/g
    str = str.replace(dobRegex, (match) => this.createAnonymousId(match, map))

    // Bank account numbers (basic pattern)
    const accountRegex = /\b\d{8,17}\b/g
    str = str.replace(accountRegex, (match) => {
      // Only anonymize if it looks like an account number (8+ digits)
      if (match.length >= 8) {
        return this.createAnonymousId(match, map)
      }
      return match
    })

    return str
  }

  private shouldAnonymizeKey(key: string): boolean {
    const sensitiveKeys = [
      'name', 'email', 'phone', 'address', 'ssn', 'dob', 'birthdate',
      'firstName', 'lastName', 'fullName', 'clientName', 'beneficiary',
      'spouse', 'child', 'parent', 'guardian', 'executor', 'trustee',
      'witness', 'attorney', 'accountNumber', 'routingNumber', 'taxId'
    ]
    return sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive.toLowerCase())
    )
  }

  private createAnonymousId(original: string, map: AnonymizationMap): string {
    if (map[original]) {
      return map[original]
    }
    
    const anonymousId = `ANON_${nanoid(8)}`
    map[original] = anonymousId
    return anonymousId
  }

  private encryptAnonymizationMap(map: AnonymizationMap): AnonymizationMap {
    const encrypted: AnonymizationMap = {}
    for (const [key, value] of Object.entries(map)) {
      const encryptedKey = CryptoJS.AES.encrypt(key, this.anonymizationKey).toString()
      encrypted[encryptedKey] = value
    }
    return encrypted
  }

  private decryptAnonymizationMap(encryptedMap: AnonymizationMap): AnonymizationMap {
    const decrypted: AnonymizationMap = {}
    for (const [encryptedKey, value] of Object.entries(encryptedMap)) {
      try {
        const decryptedKey = CryptoJS.AES.decrypt(encryptedKey, this.anonymizationKey).toString(CryptoJS.enc.Utf8)
        if (decryptedKey) {
          decrypted[decryptedKey] = value
        }
      } catch (error) {
        console.error('Failed to decrypt anonymization key:', error)
      }
    }
    return decrypted
  }
}

// Utility function for testing anonymization
export function testAnonymization() {
  const anonymizer = DataAnonymizer.getInstance()
  
  const testData = {
    clientName: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main Street",
    ssn: "123-45-6789",
    spouse: "Jane Smith",
    children: ["Michael Smith", "Sarah Smith"],
    will: {
      executor: "Robert Johnson",
      beneficiaries: ["Jane Smith", "Michael Smith", "Sarah Smith"],
      assets: "All property located at 123 Main Street"
    }
  }

  console.log('Original data:', testData)
  
  const { anonymizedData, anonymizationMap } = anonymizer.anonymizeData(testData)
  console.log('Anonymized data:', anonymizedData)
  
  const deanonymizedData = anonymizer.deanonymizeData(anonymizedData, anonymizationMap)
  console.log('Deanonymized data:', deanonymizedData)
  
  return { original: testData, anonymized: anonymizedData, deanonymized: deanonymizedData }
}