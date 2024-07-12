import { getSwaggerSpec } from '../../../config/swagger';

/**
 * Docs controller
 *
 * @return {Object}
 *
 */
const DocsController = () => ({
  /**
   * Generate swagger docs
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   *
   * @return {any}
   *
   */
  generate: async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const host = req.get('host');
    const swaggerSpec = getSwaggerSpec(host);
    res.send(swaggerSpec);
  }
});

export default DocsController;
