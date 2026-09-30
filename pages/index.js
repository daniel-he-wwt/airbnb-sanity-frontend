import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"
import { useState, useMemo } from "react"

const Home = ({ properties }) => {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) {
      return properties
    }
    return properties.filter((property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [properties, searchQuery])

  console.log(properties)
  return (
    <>
      {properties && (
        <div className="main">
          <div className="feed-container">
            <h1>Places to stay near you</h1>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search properties by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
            </div>
            <div className="feed">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <Link href={`property/${property.slug.current}`}>
                    <div key={property._id} className="card">
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
              ) : (
                <p className="no-results">No properties found matching "{searchQuery}"</p>
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
