import { useEffect, useState } from "react";
import { ServicesContext } from "./servicesContext";
import { services as sampleServices } from "../data/services";

function ServicesProvider({ children }) {
  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem("bookflowServices");

    if (savedServices) {
      return JSON.parse(savedServices);
    }

    return sampleServices;
  });

  useEffect(() => {
    localStorage.setItem("bookflowServices", JSON.stringify(services));
  }, [services]);

  const addService = (serviceData) => {
    const newService = {
      id: Date.now(),
      name: serviceData.name,
      description: serviceData.description,
      price: Number(serviceData.price),
      duration: serviceData.duration,
      active: true,
    };

    setServices((prevServices) => [newService, ...prevServices]);
  };

  const toggleService = (serviceId) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, active: !service.active }
          : service,
      ),
    );
  };

  const deleteService = (serviceId) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== serviceId),
    );
  };

  const value = {
    services,
    addService,
    toggleService,
    deleteService,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export default ServicesProvider;
