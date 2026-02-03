// Script to get Calendly Organization and Event Type information
// Run this with: node GET_CALENDLY_INFO.js

const CALENDLY_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN_HERE'; // Replace with your token

async function getCalendlyInfo() {
  console.log('🔍 Fetching Calendly information...\n');

  try {
    // Get current user info
    console.log('1️⃣ Getting user info...');
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`API Error: ${userResponse.status} - ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const user = userData.resource;
    
    console.log('✅ User Info:');
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   User URI:', user.uri);
    console.log('   Organization URI:', user.current_organization);
    console.log('');

    // Get organization details
    console.log('2️⃣ Getting organization details...');
    const orgResponse = await fetch(user.current_organization, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const orgData = await orgResponse.json();
    const org = orgData.resource;
    
    console.log('✅ Organization Info:');
    console.log('   Name:', org.name || 'N/A');
    console.log('   URI:', org.uri);
    console.log('');

    // Get event types
    console.log('3️⃣ Getting event types...');
    const eventTypesResponse = await fetch(
      `https://api.calendly.com/event_types?user=${user.uri}&active=true`,
      {
        headers: {
          'Authorization': `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const eventTypesData = await eventTypesResponse.json();
    
    console.log('✅ Event Types:');
    eventTypesData.collection.forEach((eventType, index) => {
      console.log(`\n   ${index + 1}. ${eventType.name}`);
      console.log(`      URI: ${eventType.uri}`);
      console.log(`      Duration: ${eventType.duration} minutes`);
      console.log(`      Type: ${eventType.type}`);
      console.log(`      Slug: ${eventType.slug}`);
    });

    console.log('\n\n📋 SUMMARY - Save these values:\n');
    console.log('================================');
    console.log('CALENDLY_TOKEN:', CALENDLY_TOKEN);
    console.log('ORGANIZATION_URI:', user.current_organization);
    console.log('USER_URI:', user.uri);
    console.log('================================\n');

    console.log('🎯 Next Steps:');
    console.log('1. Copy the ORGANIZATION_URI above');
    console.log('2. In Firebase Console, go to your therapist user document');
    console.log('3. Add these fields:');
    console.log('   - calendlyToken: (your token)');
    console.log('   - calendlyOrganizationId: (the organization URI)');
    console.log('   - calendlyUserId: (the user URI)');
    console.log('');
    console.log('💡 Or run SETUP_THERAPIST_CALENDLY.js to do it automatically');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure you:');
    console.log('1. Replaced YOUR_PERSONAL_ACCESS_TOKEN_HERE with your actual token');
    console.log('2. Have a valid Calendly account with API access');
  }
}

getCalendlyInfo();
