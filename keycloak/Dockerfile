# Use the Keycloak base image
FROM quay.io/keycloak/keycloak:24.0.4

# Set environment variables
ENV KEYCLOAK_ADMIN=admin \
    KEYCLOAK_ADMIN_PASSWORD=admin

COPY ./theme /opt/keycloak/themes/theme

# Command to start Keycloak in dev mode
CMD ["start-dev"]