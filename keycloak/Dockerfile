# Use the Keycloak base image
FROM quay.io/keycloak/keycloak:24.0.4

# Set environment variables
ENV KEYCLOAK_ADMIN=admin \
    KEYCLOAK_ADMIN_PASSWORD=admin

# Expose the Keycloak port
EXPOSE 8096

# Set the working directory
WORKDIR /opt/jboss/keycloak/standalone

COPY ./alfresco-keycloak-theme /opt/keycloak/themes/

# Mount the volume
VOLUME /opt/jboss/keycloak/standalone/data

# Command to start Keycloak in dev mode
CMD ["start-dev"]