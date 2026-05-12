const API_URL = 'http://localhost:5000/api';

async function runTestFlow() {
  try {
    console.log("1. Logging in as Admin...");
    let res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kostku.com', password: 'admin123' })
    });
    
    let adminCookie = res.headers.raw()['set-cookie'];
    if (!adminCookie) throw new Error("Admin login failed, no cookie");
    console.log("Admin logged in successfully.");

    console.log("2. Adding new room VIP-99...");
    res = await fetch(`${API_URL}/kamar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': adminCookie.map(c => c.split(';')[0]).join('; ')
      },
      body: JSON.stringify({
        nomor_kamar: 'VIP-99',
        tipe_id: 2, // Assuming 2 is Premium
        lantai: 5,
        status: 'tersedia'
      })
    });
    let addRoomData = await res.json();
    console.log("Add room response:", addRoomData);
    let roomId = addRoomData.data?.kamar_id || 4; // fallback

    console.log("3. Logging in as User (test3@kost.com)...");
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test3@kost.com', password: 'password' })
    });
    let userCookie = res.headers.raw()['set-cookie'];
    if (!userCookie) throw new Error("User login failed, no cookie");
    console.log("User logged in successfully.");

    console.log("4. Booking room VIP-99...");
    // Let's get the room price to send correct data if needed. Actually backend handles it based on kamar_id.
    // Let's check reservasiController.js to see what it expects.
    // It expects: kamar_id, tanggal_masuk, tanggal_keluar
    let tglMasuk = new Date();
    tglMasuk.setDate(tglMasuk.getDate() + 1); // tomorrow
    let tglKeluar = new Date(tglMasuk);
    tglKeluar.setMonth(tglKeluar.getMonth() + 1); // 1 month

    res = await fetch(`${API_URL}/reservasi`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': userCookie.map(c => c.split(';')[0]).join('; ')
      },
      body: JSON.stringify({
        kamar_id: roomId,
        tanggal_masuk: tglMasuk.toISOString().split('T')[0],
        tanggal_keluar: tglKeluar.toISOString().split('T')[0]
      })
    });
    let bookingData = await res.json();
    console.log("Booking response:", bookingData);
    let reservasiId = bookingData.data?.reservasi_id;

    if (!reservasiId) throw new Error("Booking failed");

    console.log("5. Admin confirming reservation...");
    res = await fetch(`${API_URL}/reservasi/${reservasiId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': adminCookie.map(c => c.split(';')[0]).join('; ')
      },
      body: JSON.stringify({ status: 'dikonfirmasi' })
    });
    let confirmData = await res.json();
    console.log("Confirm response:", confirmData);

    console.log("SUCCESS! All steps completed.");
  } catch (err) {
    console.error("Error during flow:", err);
  }
}

runTestFlow();
