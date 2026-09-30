import { useState } from "react"
import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"

const Home = ({ properties }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProperties = properties
    ? properties.filter((property) =>
        property.title
          ?.toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      )
    : []

  return (
    <>
      {properties && (
        <div className="main">
          <div className="feed-container">
            <h1>Places to stay near you</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search properties by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="feed">
              {filteredProperties.length === 0 ? (
                <p>No properties found.</p>
              ) : (
                filteredProperties.map((property) => (
                  <Link href={`property/${property.slug.current}`} key={property._id}>
                    <div className="card">
                      <img src={urlFor(property.mainImage)} />
                      <p>
                        {property.reviews.length} review
                        {isMultiple(property.reviews.length)}
                      </p>
                      <h3>{property.title}</h3>
                      <h3>
                        <b>£{property.pricePerNight}/per Night</b>
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="map">
            <DashboardMap properties={filteredProperties} />
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)

  if (!properties.length) {
    return {
      props: {
        properties: [],
      },
    }
  } else {
    return {
      props: {
        properties,
      },
    }
  }
}

export default Home
