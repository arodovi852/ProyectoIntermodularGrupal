import axios from 'axios';

export const generarPlaylist = async (req, res) => {
  const {
    energia,
    valencia,
    tempo
} = req.body;

  try {
    const response = await axios.get('https://api.reccobeats.com/recommendations', {
      params: {
        energia,
        valencia,
        tempo
    }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
        error: 'Error generando playlist'
    });
  }
};

