import { APP_NAME } from "@/lib/brand";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-10 text-sm text-muted-foreground">
        <p className="font-heading text-lg font-medium text-foreground">{APP_NAME}</p>
        <p className="max-w-xl">
          {APP_NAME} est un coach alimentaire numérique. Ce service propose des conseils
          alimentaires généraux et prudents ; il ne pose pas de diagnostic médical, ne remplace
          pas l&apos;avis d&apos;un professionnel de santé et ne garantit aucun résultat de perte
          de poids. En cas de doute, de douleur ou de symptôme, consultez votre médecin.
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
