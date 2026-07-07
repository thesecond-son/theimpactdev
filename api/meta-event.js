export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed',
      });
    }
  
    try {
      const body = req.body;
  
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${process.env.META_PIXEL_ID}/events`,
        {
          method: 'POST',
  
          headers: {
            'Content-Type': 'application/json',
          },
  
          body: JSON.stringify({
            data: [
              {
                event_name: body.event_name,
  
                event_time: Math.floor(Date.now() / 1000),
  
                action_source: 'website',
  
                event_id: body.event_id,
  
                user_data: {
                  client_ip_address:
                    req.headers['x-forwarded-for'] ||
                    req.socket.remoteAddress,
  
                  client_user_agent:
                    req.headers['user-agent'],
                },
  
                custom_data: body.custom_data || {},
              },
            ],
  
            access_token:
              process.env.META_ACCESS_TOKEN,
          }),
        }
      );
  
      const data = await response.json();
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        error: 'Meta Conversion API failed',
      });
    }
  }