import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import TableAdmin from "../../components/admin/TableAdmin";
import FormAdmin from "../../components/admin/FormAdmin";
import { AdminStagiaireAPI } from "../../services/admin/adminApi";
import {
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

interface Stagiaire {
  id: number;
  user?: { name: string; email: string };
  prenom: string;
  telephone: string;
  ville?: string;
  statut?: number;
}

export default function Stagiaires() {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(
    null
  );
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Charger les stagiaires
  const fetchStagiaires = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const response = await AdminStagiaireAPI.getAll(pageNum, searchTerm);
      setStagiaires(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des stagiaires:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStagiaires(search, page);
  }, [page]);

  // Recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchStagiaires(value, 1);
  };

  // Créer/Modifier
  const handleSave = async (data: any) => {
    try {
      if (selectedStagiaire?.id) {
        await AdminStagiaireAPI.update(selectedStagiaire.id, data);
      } else {
        await AdminStagiaireAPI.create(data);
      }
      setShowForm(false);
      setSelectedStagiaire(null);
      fetchStagiaires(search, page);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      return;
    }
    try {
      await AdminStagiaireAPI.delete(id);
      fetchStagiaires(search, page);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Importer Excel
  const handleImport = async () => {
    if (!importFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);

      // Utiliser l'API pour importer (adapter selon votre backend)
      const response = await fetch(
        "http://127.0.0.1:3000/api/admin/stagiaires/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Import réussi");
        setImportFile(null);
        setShowImportModal(false);
        fetchStagiaires(search, page);
      } else {
        alert("Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    } finally {
      setImportLoading(false);
    }
  };

  // Télécharger modèle Excel
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/stagiaires-template.xlsx";
    link.download = "stagiaires-template.xlsx";
    link.click();
  };

  const columns = [
    { key: "user.name", label: "Nom", sortable: true },
    { key: "prenom", label: "Prénom", sortable: true },
    { key: "telephone", label: "Téléphone" },
    { key: "user.email", label: "Email" },
    { key: "ville", label: "Ville", sortable: true },
  ];

  const formFields = [
    { name: "user_id", label: "Utilisateur", type: "number" },
    { name: "prenom", label: "Prénom", type: "text", required: true },
    { name: "telephone", label: "Téléphone", type: "tel" },
    { name: "ville", label: "Ville", type: "text" },
    { name: "statut", label: "Statut", type: "select", options: [
      { value: 1, label: "Actif" },
      { value: 0, label: "Inactif" },
    ]},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stagiaires</h1>
            <p className="text-gray-600 mt-1">
              Gestion des stagiaires de la plateforme
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={18} />
              Modèle Excel
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload size={18} />
              Importer
            </button>
            <button
              onClick={() => {
                setSelectedStagiaire(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <Plus size={18} />
              Nouveau
            </button>
          </div>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, email..."
                value={search}
                onChange={handleSearch}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : stagiaires.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun stagiaire trouvé
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stagiaires.map((stagiaire) => (
                    <tr key={stagiaire.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {stagiaire.user?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {stagiaire.prenom}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {stagiaire.telephone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <a
                          href={`mailto:${stagiaire.user?.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {stagiaire.user?.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {stagiaire.ville}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedStagiaire(stagiaire);
                              setShowDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Afficher les détails"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStagiaire(stagiaire);
                              setShowForm(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(stagiaire.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {page} sur {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedStagiaire ? "Modifier le stagiaire" : "Nouveau stagiaire"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedStagiaire(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <FormAdmin
                fields={formFields}
                initialData={selectedStagiaire}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedStagiaire(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Modal Détails */}
        {showDetails && selectedStagiaire && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Détails du stagiaire
                </h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedStagiaire(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nom
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedStagiaire.user?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Prénom
                  </label>
                  <p className="text-gray-900">{selectedStagiaire.prenom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-blue-600">
                    {selectedStagiaire.user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Téléphone
                  </label>
                  <p className="text-gray-900">{selectedStagiaire.telephone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Ville
                  </label>
                  <p className="text-gray-900">
                    {selectedStagiaire.ville || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Statut
                  </label>
                  <p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedStagiaire.statut === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedStagiaire.statut === 1 ? "Actif" : "Inactif"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Importation */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Importer des stagiaires
                </h2>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier Excel
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Format accepté: Excel (.xlsx, .xls)
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {importLoading ? "Importation..." : "Importer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
