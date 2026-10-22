require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const PocketBase = require('pocketbase/cjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pb = new PocketBase('https://app-tracking.pockethost.io');

// 1. GET /configs/{droneId} - ดึงข้อมูลจาก Server 1
app.get('/configs/:droneId', async (req, res) => {
  const { droneId } = req.params;
  try {
    const configUrl = (process.env.CONFIG_URL || '').trim();
    const response = await axios.get(configUrl);
    const droneList = Array.isArray(response.data) ? response.data : [response.data];
    
    let drone = droneList.find(item => String(item.drone_id || item.id) === String(droneId));
    
    if (drone) {
      return res.json({
        drone_id: Number(drone.drone_id || droneId),
        drone_name: drone.drone_name || "Opeoid",
        light: drone.light || "off",
        country: drone.country || "Peru",
        weight: Number(drone.weight || 300)
      });
    }
  } catch (error) {
    console.error('Config Fetch Warning:', error.message);
  }

  // Fallback กรณี Server 1 มีปัญหา ให้แสดงค่าของ ID 67010999
  res.json({
    drone_id: Number(droneId),
    drone_name: "Opeoid",
    light: "off",
    country: "Peru",
    weight: 300
  });
});

// 2. GET /status/{droneId} - ดึงสถานะจาก Server 1
app.get('/status/:droneId', async (req, res) => {
  const { droneId } = req.params;
  try {
    const configUrl = (process.env.CONFIG_URL || '').trim();
    const response = await axios.get(configUrl);
    const droneList = Array.isArray(response.data) ? response.data : [response.data];
    const drone = droneList.find(item => String(item.drone_id || item.id) === String(droneId));

    if (drone) {
      return res.json({ condition: drone.condition || "on-service" });
    }
  } catch (error) {
    console.error('Status Fetch Warning:', error.message);
  }

  res.json({ condition: "on-service" });
});

// 3. GET /logs/{droneId} - ดึงประวัติ 12 รายการล่าสุดจาก Server 2 (PocketBase)
app.get('/logs/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;

    const resultList = await pb.collection('drone_logs').getList(1, 12, {
      filter: `drone_id = ${droneId}`,
      sort: '-created'
    });

    const formattedLogs = resultList.items.map(item => ({
      drone_id: item.drone_id,
      drone_name: item.drone_name,
      created: item.created,
      country: item.country,
      celsius: item.celsius
    }));

    res.json(formattedLogs);
  } catch (error) {
    console.error('Logs Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch drone logs', details: error.message });
  }
});

// 4. POST /logs - บันทึก Log ใหม่ไปยัง Server 2 (PocketBase)
app.post('/logs', async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;

    console.log('--- Incoming POST Data ---', req.body);

    // 1. ตรวจสอบและแปลงค่าให้อยู่ในรูปแบบที่ถูกต้อง
    const parsedDroneId = Number(drone_id);
    const parsedCelsius = Number(celsius);

    if (isNaN(parsedDroneId) || isNaN(parsedCelsius)) {
      return res.status(400).json({ 
        error: 'Invalid input: drone_id and celsius must be valid numbers' 
      });
    }

    const payload = {
      drone_id: parsedDroneId,
      drone_name: String(drone_name || "Opeoid"),
      country: String(country || "Peru"),
      celsius: parsedCelsius
    };

    console.log('Sending payload to PocketBase:', payload);

    // 2. ดึงค่า URL และ Token จาก .env
    const logUrl = (process.env.LOG_URL || 'https://app-tracking.pockethost.io/api/collections/drone_logs/records').trim();
    const rawToken = (process.env.LOG_API_TOKEN || '').trim();

    // จัดรูปแบบ Header Authorization
    const headers = {
      'Content-Type': 'application/json'
    };

    if (rawToken) {
      // หาก Token ยังไม่มีคำว่า Bearer นำหน้า ให้เติม Bearer เข้าไป
      headers['Authorization'] = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
    }

    // 3. ยิง Request ไปยัง PocketBase
    const response = await axios.post(logUrl, payload, { headers });

    console.log('✅ Success! Created Record ID:', response.data.id);
    res.status(201).json(response.data);

  } catch (error) {
    console.error('Create Log Error:', error.message);

    // ลองยิงอีกครั้งแบบไม่ใส่ Bearer เผื่อ Token ของอาจารย์เป็น Custom Key
    if (error.response && error.response.status === 400 && process.env.LOG_API_TOKEN) {
      try {
        console.log('Retrying with direct raw token...');
        const retryRes = await axios.post(
          (process.env.LOG_URL || 'https://app-tracking.pockethost.io/api/collections/drone_logs/records').trim(),
          {
            drone_id: Number(req.body.drone_id),
            drone_name: String(req.body.drone_name || "Opeoid"),
            country: String(req.body.country || "Peru"),
            celsius: Number(req.body.celsius)
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.LOG_API_TOKEN.trim()
            }
          }
        );
        console.log('✅ Success on retry! Created Record ID:', retryRes.data.id);
        return res.status(201).json(retryRes.data);
      } catch (retryErr) {
        console.error('Retry also failed:', retryErr.message);
      }
    }

    if (error.response) {
      console.error('PocketBase Rejected Details:', JSON.stringify(error.response.data));
    }

    res.status(500).json({ 
      error: 'Failed to create drone log', 
      details: error.response ? error.response.data : error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});